/**
 * Vỏ giao diện: ghép màn hình chờ, onboarding, HUD, panel host, toast.
 * `createShell(ctx, root)` được main.ts gọi một lần.
 */
import type { AppContext, PanelDef, PanelId, Profile } from '@/core/contracts';
import { createBoot } from './boot';
import { createHud, type Hud } from './hud';
import { createOnboarding } from './onboarding';
import { createPanelHost, type PanelHost } from './panel-host';
import { applyUiSettings } from './settings-store';
import { createToaster, type ToastKind } from './toast';

export interface Shell {
  setLoading(progress: number, status?: string): void;
  hideBoot(): void;
  showOnboarding(existing?: Profile | null): Promise<Profile>;
  toast(text: string, opts?: { kind?: ToastKind; ms?: number }): void;
  hud: Hud;
  host: PanelHost;
}

let current: Shell | null = null;

/** Panel (vd Cài đặt) gọi để mở lại bước chọn nhân vật; trả hồ sơ mới nếu đã đổi. */
export async function changeCharacter(ctx: AppContext): Promise<Profile | null> {
  if (!current) return null;
  ctx.closePanel();
  const next = await current.showOnboarding(ctx.profile);
  const changed = JSON.stringify(next) !== JSON.stringify(ctx.profile);
  if (changed) {
    ctx.setProfile(next);
    ctx.toast('Đã đổi nhân vật.', { kind: 'good' });
  }
  return changed ? next : null;
}

export function createShell(
  ctx: AppContext,
  root: HTMLElement,
  opts: { loadPanel?: (id: PanelId) => Promise<PanelDef> } = {},
): Shell {
  const boot = createBoot();
  const toastEl = document.getElementById('toast') ?? (() => {
    const d = document.createElement('div');
    d.className = 'toast';
    d.id = 'toast';
    document.body.append(d);
    return d;
  })();
  const toast = createToaster(toastEl);
  const loadPanel = opts.loadPanel ?? ((id: PanelId) => import('./panels/registry').then((m) => m.loadPanel(id)));
  const host = createPanelHost(ctx, loadPanel, root);
  const hud = createHud(ctx, root);
  const onboarding = createOnboarding(ctx);
  applyUiSettings();

  const shell: Shell = {
    setLoading: (p, s) => boot.set(p, s),
    hideBoot: () => boot.hide(),
    showOnboarding: (existing = null) => onboarding.run(existing),
    toast,
    hud,
    host,
  };
  current = shell;
  return shell;
}
