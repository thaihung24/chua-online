# Chùa Liên Hoa — Kiến trúc & phân công

Dự án: **chùa online 3D** (Vite + TypeScript + three.js, máy chủ Node/Express + `ws`). Tiếng Việt toàn bộ giao diện.
Đây là bản **dựng lại độc lập** theo hành vi và trải nghiệm quan sát được từ chuasen.com (đi chùa, lễ Phật, thắp hương, tụng kinh gõ mõ, tràng hạt, thiền, đèn hoa đăng, xin quẻ, phòng nhiều người, hành trình/cấp/chuỗi giữ lửa…). **KHÔNG sao chép mã/asset/văn bản gốc**; mọi mã, hình dựng thủ tục, âm tổng hợp, câu chữ đều tự viết. Kinh văn Phật giáo là văn bản công cộng (ghi nguồn "bản Hán-Việt phổ biến").

Tài liệu tham khảo hành vi/giao diện gốc (chỉ để HIỂU, không chép): `docs/reference/` (ảnh màn hình, `strings.txt` = chuỗi UI đã trích, `pretty/` = bundle gốc đã định dạng, `ref-style.css`).
Máy chủ gốc đã được đối chiếu: các endpoint `/api/lobby, /api/rooms, /api/bxh, /api/feedback, /api/friends/*, /api/ref/*`.

## Quy tắc bắt buộc
1. Chỉ sửa file **thuộc phần của mình** (bảng bên dưới). File khác cần đổi → nhắn điều phối viên.
2. Đọc kỹ `src/core/contracts.ts` (kiểu + giao diện), `src/world/layout.ts` (toạ độ), `src/styles/base.css` + `tokens.css` (lớp UI dùng chung). Không đổi chúng; cần đổi thì báo.
3. Không thêm dependency mới ngoài: `three`, `express`, `ws` (runtime); `vite, typescript, tsx, vitest, puppeteer-core, concurrently` (dev). Cần thêm gì → hỏi điều phối viên.
4. TypeScript `strict`. Không `any` bừa bãi. Mỗi file có chú thích tiếng Việt ngắn nói mục đích. Chuỗi hiển thị **tiếng Việt có dấu**, giọng dịu, tôn kính, không bói toán/mê tín quá đà.
5. Hiệu năng: chạy mượt trên điện thoại tầm trung. Gộp geometry/InstancedMesh; tránh tạo object trong vòng lặp frame; `dispose()` đầy đủ.
6. Giao diện ĐẸP, hoàn thiện: bảng màu gỗ nâu / vàng đồng / sơn mài (xem tokens.css), kính mờ (glass), bo tròn, chuyển động mượt, hỗ trợ `prefers-reduced-motion`, vùng chạm ≥ 44px, `aria-*` đầy đủ, safe-area iPhone.
7. Kiểm thử bằng Chrome thật: `scripts/chrome.mjs` (`launch()` trả `{browser,page,sleep}`; WebGL phần mềm nên chậm, chờ lâu hơn). Mỗi người tạo **harness riêng** trong `dev/<tên-bạn>.html` + `dev/<tên-bạn>.ts` (Vite phục vụ mọi html ở gốc) để chạy mô-đun độc lập; chạy Vite bằng cổng riêng được giao: `npx vite --port <cổng> --strictPort`.
8. Chạy `npx tsc --noEmit 2>&1 | grep <thư-mục-của-bạn>` để chắc phần của bạn không lỗi kiểu (lỗi của người khác bỏ qua).
9. Khi xong: **báo cáo ngắn gọn** (file đã làm, API xuất ra, cách kiểm thử đã chạy, điểm còn thiếu). Đừng dừng giữa chừng; nếu thấy chỗ hợp đồng bất hợp lý, tự chọn phương án hợp lý nhất và ghi chú.

## Phân công & sở hữu file

| Mã | Phạm vi | File sở hữu | Cổng dev |
|----|---------|-------------|----------|
| **W1** | Môi trường 3D: khuôn viên, chánh điện, ao sen, bồ đề, sân thiền, Quan Âm, giếng ngọc, trời ngày/đêm, hạt bụi/đom đóm/cánh hoa, hiệu ứng lễ vật, đèn hoa đăng, quét lá | `src/world/environment.ts`, `src/world/env/**` | 5201 |
| **W2** | Nhân vật, điều khiển, camera, tìm đường, hoạt cảnh hành động, người chơi khác, cài `World` đầy đủ | `src/world/index.ts`, `src/world/avatar/**`, `src/world/player/**`, `src/world/nav.ts` | 5202 |
| **U1** | Khung UI: `index.html`, màn hình mở đầu, chọn nhân vật, HUD, menu "Thêm", thanh công phu, thông báo, host panel, icon, CSS HUD; panel: journey, rank, settings, rooms, account, feedback, share, install, friends, sayings | `index.html`, `src/ui/*.ts` (trừ panels), `src/ui/panels/{journey,rank,settings,rooms,account,feedback,share,install,friends,sayings}.ts`, `src/styles/{hud,onboarding,panels-meta}.css`, `src/ui/icons.ts` | 5203 |
| **U2** | Panel thực hành: beads, chant, meditate, dharma, today, wardrobe, lantern, que, wish, listen, walk-meditation | `src/ui/panels/{beads,chant,meditate,dharma,today,wardrobe,lantern,que,wish,listen,walk-meditation}.ts`, `src/styles/practice.css` | 5204 |
| **C1** | Logic cốt lõi: lịch âm, tiến độ/tinh tấn/cấp/chuỗi/nhiệm vụ ngày/dấu ấn, hồ sơ nhân vật; test | `src/core/{lunar,progress,quests,profile}.ts`, `tests/core-*.test.ts` | 5205 |
| **C2** | Nội dung & SEO: kinh văn, lời dạy, lời nhắc, quẻ, câu chào, pháp thoại, phụ kiện; trang tĩnh SEO | `src/content/**`, `scripts/build-seo.ts`, `public/**` (icon, manifest, og, robots) | 5206 |
| **S** | Máy chủ + mạng: Express, `ws`, phòng, tài khoản, bảng xếp hạng, góp ý, bạn đạo; client `NetApi` | `server/**`, `src/net/**` | cổng API 8787 (đổi `API_PORT`) |
| **A** | Âm thanh tổng hợp WebAudio | `src/audio/**` | 5207 |
| **Điều phối** | `src/main.ts`, ghép nối, tích hợp, kiểm thử E2E, tinh chỉnh | `src/main.ts`, `src/app/**`, `dev/` khác | 5173 |

## Hợp đồng chi tiết giữa các phần (ngoài `contracts.ts`)

### W1 → W2: `src/world/environment.ts`
```ts
import * as THREE from 'three';
export interface Environment {
  /** Nhóm gốc đã chứa toàn bộ khuôn viên + trời. W2 add nhân vật vào scene riêng (cùng scene). */
  readonly group: THREE.Group;
  update(dt: number, elapsed: number, camera: THREE.Camera): void;      // gọi mỗi khung hình
  getNight(): number;                                                     // 0 ngày … 1 đêm
  setTimeOfDay(mode: 'auto' | 'day' | 'night'): void;                    // auto = giờ Việt Nam thật
  setOfferings(o: { incenseUntil?: number; flowersUntil?: number; candleUntil?: number }): void;
  addLantern(l: { id: string; color: string; mine: boolean }): void;     // thả lên ao sen, trôi chậm, tối đa ~60 đèn
  setWishRibbons(count: number): void;                                    // ruy-băng trên bồ đề
  /** Hiệu ứng tức thời. at = vị trí thế giới (mặc định theo kind). */
  playEffect(kind: 'incense' | 'flowers' | 'candle' | 'bell' | 'release' | 'loc' | 'lanternLaunch' | 'splash' | 'ribbon' | 'lotusBloom', at?: { x: number; z: number }): void;
  /** Lá đa rụng trên sân (quét được). */
  leavesRemaining(): number;
  sweepAt(x: number, z: number, radius: number): number;                  // gỡ lá trong bán kính, trả số lá đã quét
  respawnLeaves(count?: number): void;
  /** Mặt phẳng nền để raycast chạm-để-đi: trả điểm (x,z) hoặc null nếu là vật cản. */
  readonly groundPickMesh: THREE.Mesh;
  /** Ánh sáng chính (cho bóng đổ nhân vật): W2 gọi để đăng ký nhân vật vào cùng scene. */
  setQuality(q: 'low' | 'medium' | 'high'): void;
  dispose(): void;
}
export function createEnvironment(opts: {
  scene: THREE.Scene; renderer: THREE.WebGLRenderer; quality: 'low' | 'medium' | 'high';
  onProgress?: (p: number, status: string) => void;   // status tiếng Việt: "Đang dựng chánh điện…", "Đang trồng cây bồ đề…"
}): Promise<Environment>;
```
W1 sở hữu `scene.background/fog/lights/tone-mapping`. W2 sở hữu renderer, scene, camera, vòng lặp, cỡ canvas; W2 gọi `createEnvironment` và `env.update` mỗi khung.

### W2: avatar `src/world/avatar/index.ts`
```ts
export interface AvatarRig { group: THREE.Group; setAnim(a: RemotePlayer['anim']): void; update(dt: number): void; setProfile(p: Profile, level: number): void; setLabel(text: string, level: number): void; say(text: string, ms?: number): void; dispose(): void }
export function createAvatar(profile: Profile, level: number): AvatarRig;
```
Nhân vật chibi dựng thủ tục (đầu lớn, đầu trọc/tóc, tay chắp, 4 kiểu áo × 2 giới × 5 màu, phụ kiện: tràng hạt, khăn, nón lá…). Nhãn tên là DOM overlay hoặc sprite: "Tôi: Tên · Cấp N".

### C1: `src/core/lunar.ts`
```ts
export interface LunarDate { day: number; month: number; year: number; leap: boolean; canChi: { day: string; month: string; year: string } }
export function solarToLunar(y: number, m: number, d: number): LunarDate;       // theo giờ VN (UTC+7), 1801–2199
export function lunarToSolar(day: number, month: number, year: number, leap?: boolean): { y: number; m: number; d: number } | null;
export function todayVN(now?: Date): { y: number; m: number; d: number; weekday: number };
export function lunarLabel(l: LunarDate): string;                              // "Ngày 15 tháng 9 (nhuận), năm Bính Ngọ"
export interface SpecialDay { kind: 'ram' | 'mung1' | 'festival'; label: string }
export function specialDays(l: LunarDate): SpecialDay[];                        // Rằm, mùng một, Phật Đản 15/4, Vu Lan 15/7, Thành đạo 8/12, Vía Quan Âm 19/2-19/6-19/9, Vía A Di Đà 17/11, Tết 1/1…
export function nextSpecial(now?: Date): { label: string; inDays: number; y: number; m: number; d: number };
export function monthGrid(y: number, m: number): { y: number; m: number; d: number; lunar: LunarDate; specials: SpecialDay[]; inMonth: boolean }[]; // 6x7 ô cho trang lịch
```
`src/core/progress.ts`: `export function createProgress(opts?: { storageKey?: string; now?: () => number }): ProgressApi`. `src/core/profile.ts`: `defaultProfile(): Profile`, `randomName(gender): string`, `validateName(n): string | null` (trả thông báo lỗi tiếng Việt hoặc null), `loadProfile(): Profile | null`, `saveProfile(p)`, `hasProfile()`.

### C2: `src/content/*`
```ts
// kinh.ts
export interface Sutra { id: string; group: 'Thời khóa' | 'Chú' | 'Kệ & sám nguyện'; title: string; subtitle: string; blurb: string; lines: string[]; /* mỗi phần tử = một câu/ý ngắn; UI tách theo khoảng trắng để gõ mõ từng chữ */ source: string; slug: string; minutes: number }
export const SUTRAS: Sutra[]; export function getSutra(id: string): Sutra | undefined;
export const DEDICATION: string[];             // Kệ hồi hướng (4 câu)
export const SESSION_PLAN: string[];            // thứ tự gợi ý một thời khóa (id)
// teachings.ts
export const TEACHINGS: string[]; export function teachingOfDay(dayKey: string): string;
export interface Reminder { id: string; title: string; text: string } export const REMINDERS: Reminder[]; export function reminderFor(dayKey: string, drawIndex?: number): Reminder;
// que.ts
export interface Que { no: number; title: string; poem: string[]; meaning: string; tone: 'lành' | 'bình' | 'nhắc' } export const QUE_LIST: Que[]; export function drawQue(seed: number): Que;
// phrases.ts (câu chào hỏi preset — không cho gõ tự do)
export interface Phrase { id: string; group: string; text: string } export const PHRASES: Phrase[]; export function phraseText(id: string): string | undefined;
// dharma.ts
export interface DharmaTalk { id: string; title: string; speaker: string; channel: string; minutes: number; desc: string; url: string; group: 'Cho người mới' | 'Đời sống' | 'Tịnh độ' | 'Thiền' }
export const DHARMA: DharmaTalk[];   // url = đường dẫn tìm kiếm/kênh chính thức trên YouTube (KHÔNG bịa video id)
// wardrobe.ts
export interface Accessory { id: string; name: string; minLevel: number; desc: string; kind: 'hat' | 'neck' | 'hand' | 'back' } export const ACCESSORIES: Accessory[];
// lantern.ts
export const LANTERN_COLORS: { id: string; name: string; hex: string; meaning: string }[]; export const LANTERN_INTENTS: string[];
// beads.ts
export const BEAD_PHRASES: string[];  // ["Nam mô A Di Đà Phật", ...]
```

### S: giao thức
HTTP (JSON): `GET /api/lobby → RoomInfo[]`, `POST /api/rooms → RoomInfo` (phòng riêng), `GET /api/bxh?kind=level|streak → {rows:[{rank,name,level,tier,streak}]}`, `POST /api/feedback`, `POST /api/auth/{register,login,logout}`, `GET /api/auth/me`, `GET/PUT /api/progress` (đồng bộ), `/api/friends/{me,invite,accept,remove,presence}`, `GET /api/health`.
WebSocket `/ws`: JSON `{t: 'hello'|'join'|'move'|'say'|'lantern'|'profile'|…}`. Phòng công cộng tối đa 100 người, tự mở phòng mới khi đầy. Tần số move ≤ 10 Hz, server giới hạn tốc độ & kiểm tra giá trị.
`src/net/client.ts`: `export function createNet(): NetApi` + `src/net/api.ts`: `auth, rank, feedback, friends, progressSync` (fetch helpers).

### A: `src/audio/index.ts` → `export function createAudio(): AudioApi`. Tất cả âm tổng hợp (mõ, chuông, tiếng tụng/niệm giả bằng formant + drone, gió, chim, suối, ve/dế đêm). `src/audio/voices.ts`: `export const CHANT_VOICES: {id:string; name:string; desc:string}[]`.

### U1: dịch vụ UI (`src/ui/*.ts`)
- `src/ui/shell.ts`: `export function createShell(ctx: AppContext, root: HTMLElement): { setLoading(p, s), hideBoot(), showOnboarding(existing?: Profile | null): Promise<Profile>, hud: Hud, host: PanelHost }`.
- `src/ui/hud.ts`: `Hud` có `setNearby(n)`, `setLevel(view)`, `setRoom(info)`, `setSeated(bool)`, `setOnline(n)`, `notice(text, buttons?)`. HUD gọi `ctx.world.perform(...)`/`ctx.openPanel(...)`.
- `src/ui/panel-host.ts`: `createPanelHost(ctx, loadPanel)`: mở view/dialog, khoá điều khiển thế giới, nút "Quay lại chùa", phím Esc, lịch sử.
- `src/ui/icons.ts`: `icon(name: IconName, opts?: {size?: number, class?: string}): string` (SVG chuỗi, nét vàng đồng). Panel của U2 CÓ THỂ dùng; U1 nên xuất sớm các icon thường dùng: `lotus, incense, flower, candle, bell, lantern, beads, book, wood-fish (mõ), meditate, bow, broom, trophy, flame, user, users, share, close, back, check, settings, sound, mute, play, pause, restart, dice, leaf, moon, sun, sparkle, sparkles, heart, gift, cloud, scroll, hanger (trang phục), calendar, footsteps, chevron-down, chevron-right, send, mail, google, download, qr`. (Tên icon cứ tạo đủ.)

U1 và U2 dùng chung `icons.ts`: **U1 tạo file icons.ts trước tiên (trong 10 phút đầu)** và U2 import `icon` từ đó.

## Trạng thái "đã thắp" (lễ vật)
Hương cháy 20 phút, hoa tươi 30 phút, nến cháy 30 phút (`until` epoch ms), lưu localStorage (`src/app` do điều phối viên cài). `ctx.offerings()` trả về.

## Cổng & môi trường
- Dev web: `npm run dev:web` (5173) — Vite proxy `/api`, `/ws` → `http://localhost:${API_PORT||8787}`.
- Production: `npm run build` → `dist/` (Vite + trang SEO); `npm start` chạy Express phục vụ `dist/` + API + WS (`PORT`, mặc định 8787).
