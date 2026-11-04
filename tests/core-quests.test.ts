/** Kiểm thử dữ liệu quests: bảng tinh tấn, mẫu việc, dấu ấn, nhãn thống kê. */
import { describe, expect, it } from 'vitest';
import {
  LIFETIME_LABELS, STAMPS, STAMP_GROUPS, STREAK_MILESTONES, TASK_TEMPLATES, XP_TABLE, evaluateStamps, hashString, pickTasks, taskLabel,
} from '@/core/quests';

describe('quests: dữ liệu', () => {
  it('có ~14 mẫu việc, id duy nhất, nhãn tiếng Việt, đích > 0', () => {
    expect(TASK_TEMPLATES.length).toBe(14);
    expect(new Set(TASK_TEMPLATES.map((t) => t.id)).size).toBe(14);
    for (const t of TASK_TEMPLATES) {
      expect(t.label.length).toBeGreaterThan(3);
      expect(t.target).toBeGreaterThan(0);
      expect(XP_TABLE[t.kind]).toBeTruthy();
    }
    expect(TASK_TEMPLATES.filter((t) => t.easy).map((t) => t.id).sort()).toEqual(['beads', 'bow', 'greet', 'incense']);
  });

  it('mọi khoá thống kê của XP_TABLE có nhãn', () => {
    for (const [k, r] of Object.entries(XP_TABLE)) expect(LIFETIME_LABELS[r.life], k).toBeTruthy();
    expect(LIFETIME_LABELS.practiceDays).toBeTruthy();
    expect(LIFETIME_LABELS.specialDays).toBeTruthy();
  });

  it('dấu ấn: id duy nhất, 3 nhóm, nhóm đầu đúng bảy dấu ấn hành hương', () => {
    expect(new Set(STAMPS.map((s) => s.id)).size).toBe(STAMPS.length);
    expect(STAMP_GROUPS).toHaveLength(3);
    expect(STAMPS.filter((s) => s.group === 'Bảy dấu ấn hành hương')).toHaveLength(7);
    expect(STAMPS).toHaveLength(21);
    for (const s of STAMPS) {
      expect(s.name.length).toBeGreaterThan(2);
      expect(s.desc.length).toBeGreaterThan(5);
      expect(STAMP_GROUPS as readonly string[]).toContain(s.group);
    }
  });

  it('evaluateStamps theo số liệu', () => {
    const base = { life: {}, spotsEver: [], best: 0, level: 1 };
    expect(evaluateStamps(base)).toEqual([]);
    const ids = evaluateStamps({ ...base, life: { bow: 108, meditateMinutes: 1000, chantDone: 108 }, best: 30 });
    for (const id of ['first-bow', 'bow-108', 'first-meditate', 'meditate-1000', 'first-chant', 'chant-108', 'streak-7', 'streak-30']) expect(ids).toContain(id);
    expect(ids).not.toContain('streak-100');
    expect(ids).not.toContain('first-lantern');
  });

  it('mốc chuỗi tăng dần, xp 30..500', () => {
    expect(STREAK_MILESTONES.map((m) => m.days)).toEqual([3, 7, 14, 30, 60, 100, 200, 365]);
    expect(STREAK_MILESTONES[0].xp).toBe(30);
    expect(STREAK_MILESTONES[STREAK_MILESTONES.length - 1].xp).toBe(500);
    for (let i = 1; i < STREAK_MILESTONES.length; i++) expect(STREAK_MILESTONES[i].xp).toBeGreaterThan(STREAK_MILESTONES[i - 1].xp);
  });

  it('hashString ổn định và phân bố', () => {
    expect(hashString('2025-06-20')).toBe(hashString('2025-06-20'));
    expect(hashString('a')).not.toBe(hashString('b'));
    expect(hashString('x')).toBeGreaterThanOrEqual(0);
  });

  it('pickTasks: ổn định và trả nhãn', () => {
    expect(pickTasks('2025-06-20', 5)).toEqual(pickTasks('2025-06-20', 5));
    const walk = TASK_TEMPLATES.find((t) => t.id === 'walk')!;
    expect(taskLabel(walk, 'bodhi')).toBe('Đi dạo tới cây bồ đề');
    expect(pickTasks('x', 30, 3)).toHaveLength(3);
  });
});
