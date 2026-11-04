/** Trạng thái lễ vật đã thắp (hương/hoa/nến) — lưu cục bộ, hết hạn theo thời gian thật. */
import { load, save } from '@/core/store';

export interface Offerings { incenseUntil: number; flowersUntil: number; candleUntil: number }

export const DURATIONS = {
  incense: 20 * 60_000,
  flowers: 30 * 60_000,
  candle: 30 * 60_000,
} as const;

export function loadOfferings(now = Date.now()): Offerings {
  const o = load<Partial<Offerings>>('offerings', {});
  const fix = (v: unknown) => (typeof v === 'number' && v > now ? v : 0);
  return { incenseUntil: fix(o.incenseUntil), flowersUntil: fix(o.flowersUntil), candleUntil: fix(o.candleUntil) };
}
export function saveOfferings(o: Offerings): void {
  save('offerings', o);
}
export function minutesLeft(until: number, now = Date.now()): number {
  return Math.max(1, Math.ceil((until - now) / 60_000));
}
