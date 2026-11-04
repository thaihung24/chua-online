/** Kiểm thử hệ thống 20 Phật tử ảo (BotColony) trên cả core và máy chủ WebSocket/HTTP. */
import { describe, expect, it } from 'vitest';
import { BotColony, DEFAULT_BOT_COUNT } from '../src/core/bots';
import { validateName } from '../src/core/profile';
import { BOT_QUIPS, phraseText } from '../src/content/phrases';
import { BLOCKS, BOUNDS } from '../src/world/layout';
import { Client, Http, PROFILE, sleep, startTest } from './server-helpers';

describe('BotColony (20 Phật tử ảo)', () => {
  it('tạo đúng 20 nhân vật đa dạng, pháp danh hợp lệ, di chuyển tránh vật cản và chừa >= 5 bồ đoàn trống', () => {
    const says: { botId: string; phraseId: string }[] = [];
    const lanterns: { botId: string; colorHex: string }[] = [];
    const colony = new BotColony(
      DEFAULT_BOT_COUNT,
      {
        onSay: (botId, phraseId) => says.push({ botId, phraseId }),
        onLantern: (botId, colorHex) => lanterns.push({ botId, colorHex }),
      },
      123456,
    );

    expect(colony.size).toBe(20);
    const initial = colony.toRemotePlayers(phraseText);
    expect(initial).toHaveLength(20);

    const names = new Set(initial.map((p) => p.profile.name));
    expect(names.size).toBe(20);
    for (const p of initial) {
      expect(validateName(p.profile.name)).toBeNull();
      expect(p.level).toBeGreaterThanOrEqual(1);
      expect(p.x).toBeGreaterThanOrEqual(BOUNDS.x0);
      expect(p.x).toBeLessThanOrEqual(BOUNDS.x1);
      expect(p.z).toBeGreaterThanOrEqual(BOUNDS.z0);
      expect(p.z).toBeLessThanOrEqual(BOUNDS.z1);
    }

    // Mô phỏng 60 giây (300 bước x 0.2s) để kiểm tra đường đi A*, hành động, lời chào và thả đèn
    let now = Date.now();
    let movedCount = 0;
    const startCoords = new Map(initial.map((p) => [p.id, `${p.x},${p.z}`]));

    for (let i = 0; i < 300; i++) {
      now += 200;
      colony.step(0.2, now);
      const snap = colony.toRemotePlayers(phraseText);
      const seated = snap.filter((p) => p.anim === 'sit' || p.anim === 'meditate' || p.anim === 'chant');
      expect(seated.length).toBeLessThanOrEqual(3);
      for (const p of snap) {
        const insideObstacle = BLOCKS.some((b) => p.x > b.x0 && p.x < b.x1 && p.z > b.z0 && p.z < b.z1);
        expect(insideObstacle).toBe(false);
        if (`${p.x},${p.z}` !== startCoords.get(p.id)) movedCount++;
      }
    }

    expect(movedCount).toBeGreaterThan(20);
    expect(says.length).toBeGreaterThan(0);

    // Chỉ nói các câu vui trong BOT_QUIPS, không spam: hai câu tự phát cách nhau ≥ 6 giây
    const quipIds = new Set(BOT_QUIPS.map((p) => p.id));
    for (const s of says) expect(quipIds.has(s.phraseId)).toBe(true);
    const sayTimes: number[] = [];
    let simNow = Date.now();
    const counted = new BotColony(DEFAULT_BOT_COUNT, { onSay: () => sayTimes.push(simNow) }, 777);
    for (let i = 0; i < 5 * 60 * 5; i++) { simNow += 200; counted.step(0.2, simNow); }
    expect(sayTimes.length).toBeGreaterThanOrEqual(15);
    expect(sayTimes.length).toBeLessThanOrEqual(50);
    for (let i = 1; i < sayTimes.length; i++) expect(sayTimes[i] - sayTimes[i - 1]).toBeGreaterThanOrEqual(6_000);

    // Kiểm tra đáp lễ khi người thật đứng gần chắp tay
    const current = colony.toRemotePlayers(phraseText);
    const targetBot = current.find((p) => !p.say) ?? current[0];
    const saysBefore = says.length;
    for (let attempt = 0; attempt < 10 && says.length === saysBefore; attempt++) {
      colony.notifyHumanGesture(targetBot.x + 1.0, targetBot.z + 1.0, now);
      for (let step = 0; step < 15; step++) {
        now += 200;
        colony.step(0.2, now);
      }
    }
    expect(says.length).toBeGreaterThan(saysBefore);
  });

  it('đồng bộ 20 bot qua máy chủ WebSocket, đếm đúng 21 người khi có 1 người thật và xuất hiện trên /api/bxh', async () => {
    const s = await startTest({ botCount: 20 });
    try {
      const http = new Http(s.url);
      const lobby0 = await http.get('/api/lobby');
      expect(lobby0.json[0]).toMatchObject({ id: 'main-1', online: 20 });

      const c = new Client(s.url);
      const w = await c.hello(PROFILE, 8);
      expect(w.room).toMatchObject({ id: 'main-1', online: 21 });

      const snap = await c.waitFor((m) => m.t === 'players' && m.list.length === 20);
      expect(snap.list).toHaveLength(20);

      // Sau vài nhịp tick 200ms, ít nhất một vài bot đang bước đi và phát snapshot mới
      await sleep(450);
      const updates = c.msgs.filter((m) => m.t === 'players');
      expect(updates.length).toBeGreaterThanOrEqual(2);

      const rankRes = await http.get('/api/bxh?kind=level');
      expect(rankRes.status).toBe(200);
      expect(rankRes.json.rows.length).toBeGreaterThanOrEqual(20);

      c.close();
    } finally {
      await s.close();
    }
  });
});
