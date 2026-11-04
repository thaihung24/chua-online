/**
 * Cài đặt giao diện lưu cục bộ (khoá `settings` trong store): hiện Hành trình, v.v.
 * Âm thanh/đồ hoạ/ngày-đêm do panel Cài đặt gọi thẳng `ctx.audio`/`ctx.world` và lưu khoá riêng (`quality`, `timeOfDay`).
 */
import { load, save } from '@/core/store';

export interface UiSettings {
  /** Hiện nút cấp + chuỗi giữ lửa trên HUD. */
  showJourney: boolean;
}

const DEFAULTS: UiSettings = { showJourney: true };

export function getSettings(): UiSettings {
  return { ...DEFAULTS, ...load<Partial<UiSettings>>('settings', {}) };
}

export function saveSettings(patch: Partial<UiSettings>): UiSettings {
  const next = { ...getSettings(), ...patch };
  save('settings', next);
  applyUiSettings();
  return next;
}

/** Áp dụng cài đặt giao diện lên <body> (CSS ẩn/hiện theo lớp). */
export function applyUiSettings(): void {
  document.body.classList.toggle('hide-journey', !getSettings().showJourney);
}
