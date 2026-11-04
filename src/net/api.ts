/**
 * Hàm gọi HTTP /api/* cho giao diện: tài khoản, bảng xếp hạng, góp ý, bạn đạo, đồng bộ tiến độ.
 * Mọi hàm trả `{ok:true,data}` hoặc `{ok:false,error}` (tiếng Việt), KHÔNG ném lỗi; timeout 8 giây.
 */
import type { Profile } from '@/core/contracts';

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export interface AuthUser { email: string; profile: Profile; createdAt: number }
export interface RankRow { rank: number; name: string; level: number; tier: number; tierName?: string; streak: number }
export interface FriendBrief { code: string; name: string; level: number; online: boolean }
export interface FriendsMe { code: string; friends: FriendBrief[]; incoming: FriendBrief[]; outgoing: FriendBrief[] }
export interface FriendPresence { code: string; name: string; online: boolean; room: { id: string; label: string } | null }
export interface ProgressPayload { state: unknown; profile: Profile; updatedAt?: number | null; merged?: boolean }
export interface FeedbackPayload { kind: string; message: string; email?: string; ua?: string; version?: string }

const TIMEOUT_MS = 8000;

/** Origin máy chủ API/WS (để trống khi chạy cùng domain; đặt `VITE_API_ORIGIN=https://...` khi deploy Frontend trên Vercel). */
export const API_ORIGIN: string = (() => {
  try {
    const raw = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_API_ORIGIN ?? '';
    return raw.trim().replace(/\/+$/, '');
  } catch {
    return '';
  }
})();

export function apiUrl(path: string): string {
  return API_ORIGIN && path.startsWith('/') ? `${API_ORIGIN}${path}` : path;
}

const STATUS_TEXT: Record<number, string> = {
  400: 'Thông tin chưa hợp lệ, bạn kiểm tra lại nhé.',
  401: 'Bạn cần đăng nhập để dùng tính năng này.',
  403: 'Bạn chưa được phép thực hiện thao tác này.',
  404: 'Không tìm thấy dữ liệu.',
  409: 'Thông tin bị trùng, bạn kiểm tra lại nhé.',
  413: 'Dữ liệu gửi lên quá lớn.',
  429: 'Bạn thao tác hơi nhanh, xin thử lại sau ít phút.',
  500: 'Máy chủ gặp trục trặc, xin thử lại sau.',
  503: 'Máy chủ đang bận, xin thử lại sau.',
};

/** Gọi một endpoint; trả phần thân JSON (đã bỏ khoá `ok`) hoặc lỗi tiếng Việt. */
export async function call<T>(method: 'GET' | 'POST' | 'PUT', url: string, body?: unknown): Promise<ApiResult<T>> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(apiUrl(url), {
      method,
      credentials: API_ORIGIN ? 'include' : 'same-origin',
      headers: method === 'GET' ? { Accept: 'application/json' } : { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
      signal: ctl.signal,
    });
    let json: unknown = null;
    try { json = await res.json(); } catch { /* thân rỗng/không phải JSON */ }
    if (!res.ok) {
      const msg = json && typeof json === 'object' && typeof (json as { error?: unknown }).error === 'string' ? (json as { error: string }).error : '';
      return { ok: false, error: msg || STATUS_TEXT[res.status] || 'Có lỗi xảy ra, xin thử lại sau.' };
    }
    if (json && typeof json === 'object' && !Array.isArray(json)) {
      const { ok: _ok, ...rest } = json as Record<string, unknown>;
      void _ok;
      return { ok: true, data: rest as T };
    }
    return { ok: true, data: json as T };
  } catch (e) {
    const aborted = (e as { name?: string }).name === 'AbortError';
    return { ok: false, error: aborted ? 'Máy chủ phản hồi quá chậm, xin thử lại sau.' : 'Không kết nối được máy chủ, bạn kiểm tra mạng nhé.' };
  } finally {
    clearTimeout(timer);
  }
}

export const auth = {
  register: (email: string, password: string, profile: Profile): Promise<ApiResult<{ user: AuthUser }>> =>
    call('POST', '/api/auth/register', { email, password, profile }),
  login: (email: string, password: string): Promise<ApiResult<{ user: AuthUser }>> =>
    call('POST', '/api/auth/login', { email, password }),
  logout: (): Promise<ApiResult<Record<string, never>>> => call('POST', '/api/auth/logout', {}),
  /** `data.user` là null nếu chưa đăng nhập. */
  me: (): Promise<ApiResult<{ user: AuthUser | null }>> => call('GET', '/api/auth/me'),
};

export const rank = (kind: 'level' | 'streak'): Promise<ApiResult<{ rows: RankRow[] }>> =>
  call('GET', `/api/bxh?kind=${kind === 'streak' ? 'streak' : 'level'}`);

export const feedback = (payload: FeedbackPayload): Promise<ApiResult<Record<string, never>>> =>
  call('POST', '/api/feedback', payload);

export const friends = {
  me: (): Promise<ApiResult<FriendsMe>> => call('GET', '/api/friends/me'),
  invite: (code: string): Promise<ApiResult<{ status: 'invited' | 'friends' }>> => call('POST', '/api/friends/invite', { code }),
  accept: (code: string): Promise<ApiResult<Record<string, never>>> => call('POST', '/api/friends/accept', { code }),
  remove: (code: string): Promise<ApiResult<Record<string, never>>> => call('POST', '/api/friends/remove', { code }),
  presence: (): Promise<ApiResult<{ friends: FriendPresence[] }>> => call('GET', '/api/friends/presence'),
};

export const progressSync = {
  /** `data` = null nếu máy chủ chưa lưu tiến độ nào. Cần đăng nhập. */
  async get(): Promise<ApiResult<ProgressPayload | null>> {
    const r = await call<ProgressPayload>('GET', '/api/progress');
    if (!r.ok) return r;
    return { ok: true, data: r.data.state == null ? null : r.data };
  },
  /** `extra` (tuỳ chọn): cấp & chuỗi để máy chủ xếp hạng nếu `state` không chứa. */
  put: (state: unknown, profile: Profile, extra?: { level?: number; streak?: number }): Promise<ApiResult<ProgressPayload>> =>
    call('PUT', '/api/progress', { state, profile, ...(extra ?? {}) }),
};
