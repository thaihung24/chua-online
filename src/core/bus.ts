import type { Emitter } from './contracts';

/** Bộ phát sự kiện nhỏ, có kiểu. Lỗi trong một hàm lắng nghe không làm hỏng các hàm khác. */
export function createEmitter<E extends Record<string, unknown>>(): Emitter<E> {
  const map = new Map<keyof E, Set<(p: never) => void>>();
  return {
    on(type, fn) {
      let set = map.get(type);
      if (!set) map.set(type, (set = new Set()));
      set.add(fn as (p: never) => void);
      return () => this.off(type, fn);
    },
    off(type, fn) {
      map.get(type)?.delete(fn as (p: never) => void);
    },
    emit(type, payload) {
      const set = map.get(type);
      if (!set) return;
      for (const fn of [...set]) {
        try {
          (fn as (p: unknown) => void)(payload);
        } catch (err) {
          console.error('[bus] lỗi trong hàm lắng nghe', String(type), err);
        }
      }
    },
  };
}
