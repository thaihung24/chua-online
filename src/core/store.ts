/** Lưu trữ cục bộ có tiền tố, an toàn khi localStorage bị chặn (chế độ riêng tư). */
const PREFIX = 'lienhoa:';
const mem = new Map<string, string>();

function ls(): Storage | null {
  try {
    const s = window.localStorage;
    const k = '__t';
    s.setItem(k, '1');
    s.removeItem(k);
    return s;
  } catch {
    return null;
  }
}
const storage = ls();

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = storage ? storage.getItem(PREFIX + key) : mem.get(PREFIX + key) ?? null;
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}
export function save(key: string, value: unknown): void {
  const raw = JSON.stringify(value);
  try {
    if (storage) storage.setItem(PREFIX + key, raw);
    else mem.set(PREFIX + key, raw);
  } catch {
    mem.set(PREFIX + key, raw);
  }
}
export function remove(key: string): void {
  try {
    storage?.removeItem(PREFIX + key);
  } catch {
    /* bỏ qua */
  }
  mem.delete(PREFIX + key);
}
export function clearAll(): void {
  try {
    if (storage) for (const k of Object.keys(storage)) if (k.startsWith(PREFIX)) storage.removeItem(k);
  } catch {
    /* bỏ qua */
  }
  mem.clear();
}

/** Ngày theo giờ Việt Nam dạng YYYY-MM-DD (dùng cho chuỗi giữ lửa, nhiệm vụ ngày). */
export function vnDayKey(d: Date = new Date()): string {
  const t = new Date(d.getTime() + 7 * 3_600_000);
  return t.toISOString().slice(0, 10);
}
