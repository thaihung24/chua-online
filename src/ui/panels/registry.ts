import type { PanelDef, PanelId } from '@/core/contracts';

/** Mỗi panel nạp lười từ file riêng, export `panel: PanelDef`. */
const loaders: Record<PanelId, () => Promise<{ panel: PanelDef }>> = {
  journey: () => import('./journey'),
  rank: () => import('./rank'),
  beads: () => import('./beads'),
  chant: () => import('./chant'),
  meditate: () => import('./meditate'),
  dharma: () => import('./dharma'),
  today: () => import('./today'),
  wardrobe: () => import('./wardrobe'),
  lantern: () => import('./lantern'),
  que: () => import('./que'),
  wish: () => import('./wish'),
  rooms: () => import('./rooms'),
  settings: () => import('./settings'),
  feedback: () => import('./feedback'),
  account: () => import('./account'),
  share: () => import('./share'),
  friends: () => import('./friends'),
  install: () => import('./install'),
  sayings: () => import('./sayings'),
  listen: () => import('./listen'),
  walkMeditation: () => import('./walk-meditation'),
};

export async function loadPanel(id: PanelId): Promise<PanelDef> {
  const mod = await loaders[id]();
  return mod.panel;
}
