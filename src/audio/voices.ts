// Danh sách giọng niệm Phật cho radio (UI chọn theo `id`, truyền vào `setChantRadio(on, id)`).

export interface ChantVoiceInfo {
  id: string;
  name: string;
  desc: string;
  /** Đường dẫn tệp thu âm thật; nếu trống sẽ dùng chế độ Chuông mõ tổng hợp dự phòng. */
  url?: string;
  /** Đường dẫn dự phòng (ví dụ máy chủ API khác tên miền khi chạy tách Vercel/Render). */
  fallbackUrl?: string;
  /** Tệp mặc định có vòng đệm 0.5s đầu/cuối để lặp PCM liền mạch tuyệt đối. */
  guardedLoop?: boolean;
  /** Điểm đầu vòng lặp chính xác đến từng mẫu âm thanh (giây). */
  loopStart?: number;
  /** Điểm cuối vòng lặp chính xác đến từng mẫu âm thanh (giây). */
  loopEnd?: number;
  /** Đánh dấu tệp do người dùng tự chép thêm vào `public/chant/`. */
  custom?: boolean;
}

export const CHANT_VOICES: ChantVoiceInfo[] = [
  {
    id: 'nam-tram',
    name: 'Niệm Phật 6 chữ (Thầy Trí Thoát)',
    desc: 'Nam Mô A Di Đà Phật — giọng niệm trầm ấm theo nhịp chuông gia trì cổ truyền.',
    url: '/chant/nam-tram.m4a',
    guardedLoop: true,
    loopStart: 0.5,
    loopEnd: 251.412925,
  },
  {
    id: 'chuong-mo',
    name: 'Tiếng gõ mõ tĩnh tâm',
    desc: 'Tiếng gõ mõ và chuông gia trì 50 giây đầu lặp lại liền mạch — tụng kinh, thiền định, tập trung.',
    url: '/chant/chuong-mo.m4a',
    guardedLoop: true,
    loopStart: 0.5,
    loopEnd: 50.340726,
  },
  {
    id: 'hop-xuong',
    name: 'Đạo tràng đại chúng',
    desc: 'Đại chúng cùng hòa giọng niệm Nam Mô A Di Đà Phật đều đặn trong chánh điện.',
    url: '/chant/hop-xuong.m4a',
    guardedLoop: true,
  },
  {
    id: 'nu-trong',
    name: 'Nữ trong êm dịu',
    desc: 'Giọng nữ trong trẻo niệm Nam Mô A Di Đà Phật trên nền thiền nhẹ nhàng.',
    url: '/chant/nu-trong.m4a',
    guardedLoop: true,
  },
];

export const DEFAULT_CHANT_VOICE = 'nam-tram';

export function findChantVoice(id?: string): ChantVoiceInfo {
  if (id) {
    const hit = CHANT_VOICES.find((v) => v.id === id);
    if (hit) return hit;
  }
  return CHANT_VOICES[0]!;
}

/**
 * Hợp nhất danh sách tệp trong `public/chant/` từ `/api/chant`:
 * - Nếu người dùng đặt `nam-tram.mp3` đè cạnh bản mặc định → cập nhật đường dẫn sang bản mới.
 * - Nếu người dùng chép thêm tệp mới (vd `Niệm Quan Âm.mp3`) → tự động thêm vào danh sách chọn.
 */
export function mergeRemoteChantTracks(
  tracks: { id: string; name: string; url: string; custom?: boolean }[],
  resolveUrl: (u: string) => string,
): boolean {
  let changed = false;
  for (const t of tracks) {
    if (!t || !t.id || !t.url) continue;
    const resolved = resolveUrl(t.url);
    const existing = CHANT_VOICES.find((v) => v.id === t.id);
    if (existing) {
      if (t.custom) {
        if (existing.url !== resolved || existing.guardedLoop !== false) {
          existing.url = resolved;
          existing.guardedLoop = false;
          existing.loopStart = undefined;
          existing.loopEnd = undefined;
          existing.custom = true;
          changed = true;
        }
      } else if (!existing.fallbackUrl && resolved !== existing.url) {
        existing.fallbackUrl = resolved;
      }
    } else {
      CHANT_VOICES.push({
        id: t.id,
        name: t.name,
        desc: 'Bản thu âm niệm Phật riêng trong thư mục chùa.',
        url: resolved,
        guardedLoop: false,
        custom: true,
      });
      changed = true;
    }
  }
  return changed;
}
