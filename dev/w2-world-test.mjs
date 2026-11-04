// Kiểm thử toàn diện createWorld() + chụp ảnh thế giới với 30/100 người chơi, ngày/đêm, hành động, quét lá & ngồi thiền
import { launch } from '../scripts/chrome.mjs';

const assert = (cond, msg) => {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg);
};

// ── PHẦN 1: DESKTOP (1080×680) ──
{
  const { browser, page, sleep } = await launch({ width: 1080, height: 680, mobile: false });
  try {
    // 1. Mở thế giới ban ngày với 30 người chơi khác (quality=high để chụp bóng đổ sắc nét)
    await page.goto(
      'http://localhost:5202/dev/w2.html?mode=world&tod=day&quality=high&remotes=30&level=16&acc=hat-tram&say=Nam%20m%C3%B4%20A%20Di%20%C4%90%C3%A0%20Ph%E1%BA%ADt',
      { waitUntil: 'load' },
    );
    await page.waitForFunction('window.__ready === true', { timeout: 90000 });
    await page.evaluate(() => {
      const future = Date.now() + 600_000;
      window.__w.world.setOfferings({ incenseUntil: future, flowersUntil: future, candleUntil: future });
      window.__w.world.setWishRibbons(14);
      window.__w.world.addLantern({ id: 'l-1', color: '#ffb24a', mine: true });
      window.__w.world.addLantern({ id: 'l-2', color: '#ff8fb8', mine: false });
    });
    await sleep(1600);
    await page.screenshot({ path: 'dev/shots/w2-world-30.png' });
    console.log('saved dev/shots/w2-world-30.png');

    const initInfo = await page.evaluate(() => {
      const ev = window.__w.events.map((e) => e.type);
      return {
        hasReady: ev.includes('ready'),
        hasLoading: ev.includes('loading'),
        hasNight: ev.includes('night'),
        player: window.__w.world.getPlayer(),
      };
    });
    console.log('initInfo:', initInfo);
    assert(initInfo.hasReady, 'ready event emitted');
    assert(initInfo.hasLoading, 'loading event emitted');

    // Hạ xuống quality=low khi chạy chuỗi di chuyển tự động trên SwiftShader cho nhanh
    await page.evaluate(() => window.__w.world.setQuality('low'));

    // 2. Kiểm tra tapRemote: đặt 1 người chơi gần rồi click vào thân nhân vật
    await page.evaluate(() => {
      const p = window.__w.world.getPlayer();
      window.__w.world.setRemotes([
        {
          id: 'tap-test',
          profile: { name: 'Diệu Hạnh', gender: 'female', outfit: 'ao-dai', colorIndex: 1, accessory: 'lotus-hand' },
          level: 20,
          x: p.x + 1.2,
          z: p.z - 2.2,
          ry: 0,
          anim: 'pray',
        },
      ]);
    });
    await page.waitForFunction(() => {
      const t = document.querySelector('.w2-tag:not(.w2-mine)');
      return Boolean(t && t.getBoundingClientRect().width > 10);
    }, { timeout: 15000 });
    const tagBox = await page.evaluate(() => {
      const tags = [...document.querySelectorAll('.w2-tag:not(.w2-mine)')];
      const t = tags[0];
      if (!t) return null;
      const r = t.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.bottom + 36 };
    });
    console.log('tapRemote target:', tagBox);
    if (tagBox) {
      await page.mouse.click(tagBox.x, tagBox.y);
      await sleep(250);
    }
    const tapEvt = await page.evaluate(() => window.__w.events.find((e) => e.type === 'tapRemote')?.payload);
    console.log('tapEvt:', tapEvt);
    assert(tapEvt && tapEvt.id === 'tap-test', 'tapRemote emitted when tapping remote avatar');

    // 3. goTo('yard') → kiểm tra quét lá thật + stop()
    await page.evaluate(() => {
      window.__w.spawnRemotes(12);
      window.__w.world.goTo('yard');
    });
    await page.waitForFunction(
      `window.__w.events.some(e => e.type === 'spotReached' && e.payload.spot === 'yard')`,
      { timeout: 90000 },
    );

    // Chạy perform('sweep', { inPlace: true }) trên sân đầy lá rồi stop()
    const sweepStopped = await page.evaluate(async () => {
      const p = window.__w.world.perform('sweep', { inPlace: true });
      await new Promise((r) => setTimeout(r, 2600));
      window.__w.world.stop();
      await p;
      return true;
    });
    assert(sweepStopped, 'sweep started and resolved cleanly on stop()');

    // 4. goTo('hall') → spotReached + moved + nearby altar
    await page.evaluate(() => window.__w.world.goTo('hall'));
    await page.waitForFunction(
      `window.__w.events.some(e => e.type === 'spotReached' && e.payload.spot === 'hall')`,
      { timeout: 90000 },
    );
    const hallInfo = await page.evaluate(() => {
      const near = [...window.__w.events].reverse().find((e) => e.type === 'nearby');
      const moves = window.__w.events.filter((e) => e.type === 'moved');
      return { near: near?.payload, moveCount: moves.length, pos: window.__w.world.getPlayer() };
    });
    console.log('hallInfo:', hallInfo);
    assert(hallInfo.moveCount >= 3, 'moved events emitted');
    assert(hallInfo.near && hallInfo.near.id === 'altar', 'nearby altar detected');

    // 5. Thực hiện thắp hương trước lư hương Chánh Điện + chụp ảnh quality=high đúng lúc vái hương
    const incPromise = page.evaluate(() => window.__w.world.perform('incense'));
    await page.waitForFunction(
      `Math.abs(window.__w.world.getPlayer().z - (-8.75)) < 1.25`,
      { timeout: 60000 },
    );
    await sleep(1100);
    await page.evaluate(() => window.__w.world.setQuality('high'));
    await sleep(450);
    await page.screenshot({ path: 'dev/shots/w2-world-incense.png' });
    console.log('saved dev/shots/w2-world-incense.png');
    await page.evaluate(() => window.__w.world.setQuality('low'));
    await incPromise;
    const incDone = await page.evaluate(() =>
      window.__w.events.some((e) => e.type === 'actionDone' && e.payload.action === 'incense'),
    );
    assert(incDone, 'incense actionDone emitted');

    // Kiểm tra đủ 11 hành động không-quét còn lại (inPlace)
    for (const act of ['pray', 'bow', 'flowers', 'candle', 'bell', 'lantern', 'que', 'release', 'loc', 'wish']) {
      await page.evaluate((a) => window.__w.world.perform(a, { inPlace: true, payload: { color: '#ff96b8' } }), act);
    }
    const doneActs = await page.evaluate(() =>
      [...new Set(window.__w.events.filter((e) => e.type === 'actionDone').map((e) => e.payload.action))],
    );
    console.log('completed actions:', doneActs);
    assert(doneActs.length >= 11, 'all 11 non-sweep actions emitted actionDone');

    // 6. Đặt 30 người chơi (bồ đoàn 0, 2, 4 đã có người ngồi) rồi gọi sit('chant')
    await page.evaluate(() => {
      window.__w.spawnRemotes(30);
      return window.__w.world.sit('chant');
    });
    await page.waitForFunction(
      `window.__w.events.some(e => e.type === 'seated' && e.payload.seated === true)`,
      { timeout: 120000 },
    );
    await page.evaluate(() => window.__w.world.setQuality('high'));
    await sleep(650);
    const seatPayload = await page.evaluate(() =>
      [...window.__w.events].reverse().find((e) => e.type === 'seated')?.payload,
    );
    console.log('seatPayload:', seatPayload);
    assert(![0, 2, 4].includes(seatPayload.slot), 'picked free cushion slot avoiding remotes');
    await page.screenshot({ path: 'dev/shots/w2-world-sit.png' });
    console.log('saved dev/shots/w2-world-sit.png');

    // Nhấn phím W khi đang ngồi → tự động đứng dậy
    await page.keyboard.down('KeyW');
    await sleep(250);
    await page.keyboard.up('KeyW');
    await sleep(200);
    assert(await page.evaluate(() => !window.__w.world.isSeated()), 'auto stood up on move input');

    // 7. Quay lại sân chính ngắm cảnh chùa ban đêm + setInputEnabled(false) trôi camera nhẹ + screenshot()
    await page.evaluate(() => {
      window.__w.world.setQuality('low');
      window.__w.world.setTimeOfDay('night');
      window.__w.world.goTo('yard');
    });
    await page.waitForFunction(
      `window.__w.events.filter(e => e.type === 'spotReached' && e.payload.spot === 'yard').length >= 2`,
      { timeout: 90000 },
    );
    await sleep(1600);
    await page.evaluate(() => {
      window.__w.world.setQuality('high');
      window.__w.world.setInputEnabled(false);
    });
    await sleep(700);
    await page.screenshot({ path: 'dev/shots/w2-world-night.png' });
    console.log('saved dev/shots/w2-world-night.png');
    await page.evaluate(() => window.__w.world.setInputEnabled(true));

    const blobInfo = await page.evaluate(async () => {
      const b = await window.__w.world.screenshot();
      return b ? { type: b.type, size: b.size } : null;
    });
    console.log('screenshot() blob:', blobInfo);
    assert(blobInfo && blobInfo.type === 'image/jpeg' && blobInfo.size > 5000, 'screenshot() valid jpeg');

    // 8. Thử tải 100 người chơi đồng thời
    await page.evaluate(() => {
      window.__w.world.setQuality('low');
      window.__w.world.setTimeOfDay('day');
      window.__w.spawnRemotes(100);
    });
    await sleep(1200);
    const fps100 = await page.evaluate(() => window.__w.measureFps(1000));
    console.log('100 remotes SwiftShader FPS (low):', fps100);
    await page.screenshot({ path: 'dev/shots/w2-world-100.png' });
    console.log('saved dev/shots/w2-world-100.png');
  } finally {
    await browser.close();
  }
}

// ── PHẦN 2: MOBILE (430×860, cảm ứng + cần điều khiển ảo + vòng tròn điểm chạm) ──
{
  const { browser, page, sleep } = await launch({ width: 430, height: 860, mobile: true });
  try {
    await page.goto(
      'http://localhost:5202/dev/w2.html?mode=world&tod=day&quality=medium&remotes=20&level=24&gender=female&outfit=ao-dai&color=1&acc=halo-lotus&hud=0',
      { waitUntil: 'load' },
    );
    await page.waitForFunction('window.__ready === true', { timeout: 90000 });
    await sleep(800);
    // Chạm xuống sân đá để hiện vòng vàng chỉ đường
    await page.mouse.click(215, 520);
    await sleep(450);
    await page.screenshot({ path: 'dev/shots/w2-world-mobile.png' });
    console.log('saved dev/shots/w2-world-mobile.png');
  } finally {
    await browser.close();
  }
}

console.log('ALL WORLD ASSERTIONS PASSED!');
