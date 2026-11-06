/** Thế giới rỗng: dùng khi thiết bị không hỗ trợ WebGL — HUD và các panel (niệm Phật, tụng kinh, thiền…) vẫn dùng được. */
import { createEmitter } from '@/core/bus';
import type { World, WorldEvents } from '@/core/contracts';

export function createNullWorld(): World {
  const em = createEmitter<WorldEvents>();
  let seated = false;
  return {
    on: em.on.bind(em),
    off: em.off.bind(em),
    emit: em.emit.bind(em),
    async mount() {
      em.emit('ready', undefined);
    },
    setProfile() {},
    goTo() {},
    stop() {},
    async perform(action) {
      // Không có hoạt cảnh: vẫn ghi nhận để tiến độ/lễ vật hoạt động.
      await new Promise((r) => setTimeout(r, 600));
      em.emit('actionDone', { action });
    },
    sit() {
      seated = true;
      em.emit('seated', { seated: true, slot: 0 });
      return true;
    },
    standUp() {
      seated = false;
      em.emit('seated', { seated: false, slot: null });
    },
    isSeated: () => seated,
    setInputEnabled() {},
    setRemotes() {},
    say() {},
    setOfferings() {},
    addLantern() {},
    setWishRibbons() {},
    setTimeOfDay() {},
    setQuality() {},
    setPaused() {},
    dispose() {},
    async screenshot() {
      return null;
    },
    getPlayer: () => ({ x: 0, z: 0, ry: 0 }),
    getChickenState: () => ({ lostCount: 0, carrying: false, hintSpot: null, totalInCoop: 5 }),
    goToLostChicken: () => false,
  };
}
