/**
 * Chạy "việc hôm nay": mở panel tương ứng, tự đi tới điểm tương tác rồi làm, hoặc đi dạo tới điểm hẹn.
 * Dùng chung cho panel Hành trình và thẻ "Việc hôm nay" trên HUD.
 */
import type { ActionId, AppContext, DailyTask, PanelId, SpotId } from '@/core/contracts';
import type { IconName } from './icons';

export const PANEL_IDS = new Set<string>(['journey', 'rank', 'beads', 'chant', 'meditate', 'dharma', 'today', 'wardrobe', 'lantern', 'que', 'wish', 'rooms', 'settings', 'feedback', 'account', 'share', 'friends', 'install', 'sayings', 'listen', 'walkMeditation']);
export const SPOT_IDS = new Set<string>(['yard', 'bodhi', 'meditate', 'quanam', 'well', 'hall']);
export const ACTION_IDS = new Set<string>(['pray', 'bow', 'sweep', 'incense', 'flowers', 'candle', 'bell', 'lantern', 'que', 'release', 'loc', 'wish']);

/** Việc này mở một bảng (Mở) hay cần đi trong sân chùa (Đi). */
export function taskVerb(t: DailyTask): 'Mở' | 'Đi' {
  const a = t.action as string | undefined;
  if (a && PANEL_IDS.has(a) && !(t.kind === 'walkSpot' && SPOT_IDS.has(a))) return 'Mở';
  return 'Đi';
}

const KIND_ICON: Partial<Record<DailyTask['kind'], IconName>> = {
  beadsRound: 'beads', beads: 'beads', incense: 'incense', bow: 'bow', pray: 'hands', chantDone: 'book',
  meditateSeconds: 'meditate', sitSeconds: 'cushion', sweepRound: 'broom', walkSpot: 'footsteps', lantern: 'lantern',
  flowers: 'flower', candle: 'candle', bell: 'bell', que: 'sticks', release: 'fish', loc: 'leaf', wish: 'ribbon',
  listenSeconds: 'headphones', greet: 'heart', quanam: 'sparkle', mindfulSeconds: 'leaf', communitySeconds: 'users', today: 'calendar',
};
export const taskIcon = (t: DailyTask): IconName => KIND_ICON[t.kind] ?? 'lotus';

/** Thực hiện việc hôm nay. `panelDelayMs` để chờ panel đang mở đóng hẳn rồi mới mở panel mới. */
export function runDailyTask(ctx: AppContext, t: DailyTask, panelDelayMs = 0): boolean {
  const a = t.action as string | undefined;
  if (!a) return false;
  if (t.kind === 'walkSpot' && SPOT_IDS.has(a)) { ctx.world.goTo(a as SpotId); return true; }
  if (PANEL_IDS.has(a)) {
    if (panelDelayMs > 0) window.setTimeout(() => void ctx.openPanel(a as PanelId), panelDelayMs);
    else void ctx.openPanel(a as PanelId);
    return true;
  }
  if (ACTION_IDS.has(a)) { void ctx.world.perform(a as ActionId).catch(() => undefined); return true; }
  if (SPOT_IDS.has(a)) { ctx.world.goTo(a as SpotId); return true; }
  return false;
}
