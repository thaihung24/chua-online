/**
 * Tích hợp Google Identity Services (OAuth 2.0 Token Popup) cho Chùa Rắn.
 * Tự nạp script `https://accounts.google.com/gsi/client` khi mở hộp thoại Tài khoản để giữ cử chỉ chạm đồng bộ trên iOS/Safari.
 */
import * as api from '@/net/api';

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleTokenClient {
  requestAccessToken(overrideConfig?: { prompt?: string }): void;
}

interface GoogleAccountsNamespace {
  accounts?: {
    oauth2?: {
      initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (res: GoogleTokenResponse) => void;
        error_callback?: (err: { type?: string; message?: string }) => void;
      }): GoogleTokenClient;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleAccountsNamespace;
  }
}

export const GOOGLE_LOGO_SVG = `<svg class="google-ic" width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

const ENV_CLIENT_ID: string = (() => {
  try {
    return ((import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_GOOGLE_CLIENT_ID ?? '').trim();
  } catch {
    return '';
  }
})();

let cachedClientId: string | null = ENV_CLIENT_ID || null;
let clientIdPromise: Promise<string> | null = null;
let gsiPromise: Promise<boolean> | null = null;

export async function resolveGoogleClientId(): Promise<string> {
  if (cachedClientId) return cachedClientId;
  if (!clientIdPromise) {
    clientIdPromise = api.auth.config().then((r) => {
      const id = r.ok && r.data.googleClientId ? r.data.googleClientId.trim() : '';
      if (id) cachedClientId = id;
      clientIdPromise = null;
      return id;
    }).catch(() => {
      clientIdPromise = null;
      return '';
    });
  }
  return clientIdPromise;
}

export function getCachedGoogleClientId(): string {
  return cachedClientId ?? '';
}

export function loadGsiScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.google?.accounts?.oauth2) return Promise.resolve(true);
  if (gsiPromise) return gsiPromise;
  gsiPromise = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-gsi="1"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(window.google?.accounts?.oauth2)), { once: true });
      existing.addEventListener('error', () => { gsiPromise = null; resolve(false); }, { once: true });
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.dataset.gsi = '1';
    const timer = window.setTimeout(() => { gsiPromise = null; resolve(false); }, 10_000);
    s.onload = () => {
      window.clearTimeout(timer);
      resolve(Boolean(window.google?.accounts?.oauth2));
    };
    s.onerror = () => {
      window.clearTimeout(timer);
      gsiPromise = null;
      s.remove();
      resolve(false);
    };
    document.head.append(s);
  });
  return gsiPromise;
}

/** Tải trước Client ID + thư viện Google ngay khi mở hộp thoại để lúc bấm nút không bị chặn popup trên Safari. */
export async function prepareGoogleAuth(): Promise<string> {
  const id = await resolveGoogleClientId();
  if (id) await loadGsiScript();
  return id;
}

export type GoogleTokenResult =
  | { ok: true; accessToken: string }
  | { ok: false; cancelled?: boolean; error: string };

/** Mở cửa sổ chọn tài khoản Google. Gọi ngay trong sự kiện click của nút. */
export function requestGoogleAccessToken(clientId: string, onDone: (res: GoogleTokenResult) => void): void {
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) {
    onDone({ ok: false, error: 'Chưa tải được dịch vụ đăng nhập Google, bạn kiểm tra mạng rồi thử lại nhé.' });
    return;
  }
  let settled = false;
  const finish = (r: GoogleTokenResult): void => {
    if (settled) return;
    settled = true;
    onDone(r);
  };
  try {
    const client = oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (resp) => {
        if (resp.access_token) {
          finish({ ok: true, accessToken: resp.access_token });
        } else if (resp.error === 'access_denied') {
          finish({ ok: false, cancelled: true, error: 'Đã huỷ đăng nhập Google.' });
        } else {
          finish({ ok: false, error: 'Không nhận được xác thực từ Google, bạn thử lại nhé.' });
        }
      },
      error_callback: (err) => {
        if (err?.type === 'popup_closed') {
          finish({ ok: false, cancelled: true, error: 'Đã đóng cửa sổ đăng nhập Google.' });
        } else if (err?.type === 'popup_failed_to_open') {
          finish({ ok: false, error: 'Trình duyệt đang chặn cửa sổ bật lên. Bạn cho phép popup cho trang chùa nhé.' });
        } else {
          finish({ ok: false, error: 'Không mở được đăng nhập Google, bạn thử lại nhé.' });
        }
      },
    });
    client.requestAccessToken({ prompt: 'select_account' });
  } catch {
    finish({ ok: false, error: 'Không khởi tạo được đăng nhập Google.' });
  }
}
