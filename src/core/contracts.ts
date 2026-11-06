/**
 * HỢP ĐỒNG CHUNG giữa các mô-đun (thế giới 3D, UI, âm thanh, mạng, tiến độ).
 * Chỉ chứa kiểu + hằng số + giao diện. KHÔNG chứa logic. Đổi file này phải báo cho điều phối viên.
 */

// ───────────────────────── Nhân vật ─────────────────────────
export type Gender = 'male' | 'female';
export type OutfitId = 'trang-xam' | 'trang-lam' | 'ba-ba' | 'ao-dai';

export interface Profile {
  /** Pháp danh (2–24 ký tự, đã lọc từ cấm). */
  name: string;
  gender: Gender;
  outfit: OutfitId;
  /** Chỉ số màu áo trong OUTFIT_COLORS[outfit]. */
  colorIndex: number;
  /** Phụ kiện/Trang phục đã mở khoá đang mặc (xem content/wardrobe). */
  accessory?: string;
}

export const OUTFITS: { id: OutfitId; label: string }[] = [
  { id: 'trang-xam', label: 'Tràng xám' },
  { id: 'trang-lam', label: 'Tràng lam' },
  { id: 'ba-ba', label: 'Bà ba' },
  { id: 'ao-dai', label: 'Áo dài' },
];

/** 5 màu cho mỗi kiểu áo (hex). Thứ tự = colorIndex. */
export const OUTFIT_COLORS: Record<OutfitId, { name: string; hex: string }[]> = {
  'trang-xam': [
    { name: 'Xám tro', hex: '#8d8a84' }, { name: 'Xám nâu', hex: '#7a6f66' }, { name: 'Xám đá', hex: '#6f7378' },
    { name: 'Xám sáng', hex: '#a7a49c' }, { name: 'Xám than', hex: '#55524e' },
  ],
  'trang-lam': [
    { name: 'Lam', hex: '#4f7fc4' }, { name: 'Lam nhạt', hex: '#8fb0de' }, { name: 'Lam đậm', hex: '#3d629c' },
    { name: 'Lam trời', hex: '#7fb4d6' }, { name: 'Lam ngọc', hex: '#4a8f9c' },
  ],
  'ba-ba': [
    { name: 'Nâu', hex: '#7b5638' }, { name: 'Đen', hex: '#2b2623' }, { name: 'Nâu đất', hex: '#8a6a45' },
    { name: 'Chàm', hex: '#33415f' }, { name: 'Xanh rêu', hex: '#5b6b3a' },
  ],
  'ao-dai': [
    { name: 'Vàng', hex: '#e2b24c' }, { name: 'Hồng sen', hex: '#e59ab0' }, { name: 'Trắng', hex: '#efe9dc' },
    { name: 'Xanh ngọc', hex: '#5fb59a' }, { name: 'Tím', hex: '#9a82c4' },
  ],
};

// ───────────────────────── Khuôn viên ─────────────────────────
export type SpotId = 'yard' | 'bodhi' | 'meditate' | 'quanam' | 'well' | 'hall';

/** Hành động nhân vật có hoạt cảnh riêng. */
export type ActionId =
  | 'pray'      // chắp tay
  | 'bow'       // lạy Phật
  | 'sweep'     // quét lá
  | 'incense'   // thắp hương (cắm vào lư)
  | 'flowers'   // dâng hoa lên bàn thờ
  | 'candle'    // thắp nến
  | 'bell'      // thỉnh chuông
  | 'lantern'   // thả đèn hoa đăng
  | 'que'       // lắc ống xăm
  | 'release'   // phóng sinh
  | 'loc'       // hái lộc
  | 'wish';     // treo nguyện lên cây bồ đề

export type SeatKind = 'chant' | 'meditate' | 'sit';

/** Một nhân vật khác trong phòng (từ mạng). */
export interface RemotePlayer {
  id: string;
  profile: Profile;
  level: number;
  x: number; z: number; ry: number;
  /** Trạng thái: đứng/đi/lạy/ngồi... để dựng hoạt cảnh. */
  anim: 'idle' | 'walk' | 'pray' | 'bow' | 'sweep' | 'sit' | 'chant' | 'meditate' | 'beads' | 'doze';
  /** Câu nói đang hiện (bong bóng lời) hoặc undefined. */
  say?: string;
}

export interface Emitter<E extends Record<string, unknown>> {
  on<K extends keyof E>(type: K, fn: (payload: E[K]) => void): () => void;
  off<K extends keyof E>(type: K, fn: (payload: E[K]) => void): void;
  emit<K extends keyof E>(type: K, payload: E[K]): void;
}

// ───────────────────────── Thế giới 3D ─────────────────────────
export interface WorldEvents extends Record<string, unknown> {
  /** Tiến độ nạp cảnh 0..1 + dòng trạng thái tiếng Việt (cho màn hình mở đầu). */
  loading: { progress: number; status: string };
  ready: undefined;
  /** Người chơi đi tới điểm đi dạo (tính cho nhiệm vụ "Đi dạo"). */
  spotReached: { spot: SpotId };
  /** Điểm tương tác gần nhất (hoặc null) để HUD hiện nút ngữ cảnh. */
  nearby: { id: string | null; label: string | null; actions: ActionId[] };
  /** Một hành động đã hoàn tất hoạt cảnh (UI/tiến độ lắng nghe để ghi nhận). */
  actionDone: { action: ActionId; detail?: Record<string, unknown> };
  /** Người chơi đi/ngừng đi (để mạng gửi vị trí). */
  moved: { x: number; z: number; ry: number; moving: boolean };
  /** Người chơi ngồi xuống/đứng dậy ở bồ đoàn. */
  seated: { seated: boolean; slot: number | null };
  /** Chạm vào avatar người khác. */
  tapRemote: { id: string };
  /** Chiều/đêm: 0 = ban ngày, 1 = ban đêm (để UI/âm thanh đổi theo). */
  night: { value: number };
  /** Đang tự đi tới một điểm (label = "Đang đến lư hương"…), null khi tới nơi hoặc huỷ. */
  travel: { label: string | null };
  /** Bắt đầu hoạt cảnh một hành động (sau khi đã tới nơi) — để hiện bong bóng trên đầu. */
  actionStart: { action: ActionId };
}

export interface World extends Emitter<WorldEvents> {
  /** Dựng renderer vào container, nạp cảnh, phát 'loading' rồi 'ready'. */
  mount(container: HTMLElement, profile: Profile, opts?: { level?: number }): Promise<void>;
  setProfile(profile: Profile, level?: number): void;
  /** Tự đi tới một điểm đi dạo (có tìm đường quanh vật cản). */
  goTo(spot: SpotId): void;
  /** Dừng việc tự đi. */
  stop(): void;
  /** Tới điểm tương tác rồi làm hành động (hoặc làm ngay tại chỗ nếu `inPlace`). Resolve khi xong hoạt cảnh. */
  perform(action: ActionId, opts?: { inPlace?: boolean; payload?: unknown }): Promise<void>;
  /** Ngồi vào bồ đoàn trống gần nhất (hoặc `slot` chỉ định). Trả false nếu hết chỗ. */
  sit(kind: SeatKind, slot?: number): boolean;
  standUp(): void;
  isSeated(): boolean;
  /** Điều khiển nhập liệu bị khoá khi mở panel toàn màn hình. */
  setInputEnabled(enabled: boolean): void;
  /** Đặt/đồng bộ người khác (gọi mỗi khi có gói mạng). */
  setRemotes(players: RemotePlayer[]): void;
  /** Hiện câu nói trên đầu nhân vật mình. */
  say(text: string): void;
  /** Nến/hương/hoa đã thắp: thế giới tự vẽ theo trạng thái (hết hạn do `until` epoch ms). */
  setOfferings(o: { incenseUntil?: number; flowersUntil?: number; candleUntil?: number }): void;
  /** Thêm đèn hoa đăng của bản thân (lời nguyện chỉ lưu local) và đèn của người khác (màu). */
  addLantern(l: { id: string; color: string; mine: boolean; pond: 'lotus' }): void;
  /** Ruy-băng nguyện trên cây bồ đề. */
  setWishRibbons(count: number): void;
  /** Ép chế độ ngày/đêm (undefined = theo giờ thật tại Việt Nam, UTC+7). */
  setTimeOfDay(mode: 'auto' | 'day' | 'night'): void;
  setQuality(q: 'low' | 'medium' | 'high'): void;
  setPaused(paused: boolean): void;
  dispose(): void;
  /** Chụp ảnh khung hình hiện tại (cho "Khoe thành tích"). */
  screenshot(): Promise<Blob | null>;
  /** Vị trí hiện tại của người chơi. */
  getPlayer(): { x: number; z: number; ry: number };
}

// ───────────────────────── Âm thanh ─────────────────────────
export interface AudioSettings {
  master: boolean;
  ambient: boolean; // nhạc nền
  sfx: boolean; // mõ & chuông
  chant: boolean; // giọng niệm Phật & nhạc nền chung
  ambientVolume: number; // 0..1
}
export type Sfx = 'mo' | 'bell' | 'bellBig' | 'bead' | 'incense' | 'flower' | 'candle' | 'lantern' | 'bow' | 'click' | 'chime' | 'levelUp' | 'sweep' | 'que' | 'splash' | 'ribbon';
export interface MusicTrack { name: string; url: string }
export interface AudioApi {
  /** Phải gọi trong cử chỉ người dùng đầu tiên (mở AudioContext). */
  unlock(): void;
  play(s: Sfx, opts?: { volume?: number; pitch?: number }): void;
  /** Nhịp mõ tụng kinh/niệm Phật: BPM; trả hàm dừng. */
  startMoLoop(bpm: number): () => void;
  /** Nền: tiếng gió, chim, suối, nhạc nền Phật giáo tổng hợp, đổi theo ngày/đêm. */
  setAmbient(on: boolean): void;
  /** Đặt danh sách bài nhạc nền chung của chùa (.mp3/.ogg/.wav); rỗng = quay về nhạc thiền tổng hợp. */
  setMusicTracks?(tracks: MusicTrack[], startedAt?: number, serverNow?: number): void;
  setNight(v: number): void;
  /** "Nghe niệm Phật": loop niệm Phật tổng hợp (mõ + drone + chuỗi âm). */
  setChantRadio(on: boolean, voice?: string): void;
  settings(): AudioSettings;
  configure(patch: Partial<AudioSettings>): void;
  onChange(fn: (s: AudioSettings) => void): () => void;
}

// ───────────────────────── Tiến độ / Hành trình ─────────────────────────
/** Mọi hoạt động có thể tính tinh tấn. */
export type ActivityKind =
  | 'visit' | 'pray' | 'bow' | 'incense' | 'flowers' | 'candle' | 'bell' | 'lantern' | 'que'
  | 'beadsRound' | 'chantDone' | 'meditateSeconds' | 'sitSeconds' | 'sweepRound' | 'walkSpot'
  | 'release' | 'loc' | 'wish' | 'listenSeconds' | 'communitySeconds' | 'today' | 'greet' | 'quanam' | 'mindfulSeconds' | 'beads';

export interface TierDef { id: number; name: string; minLevel: number; color: string; accent: string }
export const TIERS: TierDef[] = [
  { id: 1, name: 'Hạt sen', minLevel: 1, color: '#8a6a4a', accent: '#c9a77c' },
  { id: 2, name: 'Mầm sen', minLevel: 5, color: '#6f9a4e', accent: '#b9d79a' },
  { id: 3, name: 'Lá sen', minLevel: 10, color: '#3f8a5c', accent: '#93c9a4' },
  { id: 4, name: 'Nụ sen', minLevel: 15, color: '#d77a95', accent: '#f4c2cf' },
  { id: 5, name: 'Sen hé', minLevel: 20, color: '#e0708f', accent: '#f8d2dc' },
  { id: 6, name: 'Sen nở', minLevel: 30, color: '#e8899f', accent: '#f6d48a' },
  { id: 7, name: 'Sen ngàn cánh', minLevel: 50, color: '#d9a641', accent: '#f7e3a4' },
];

export interface ProgressView {
  level: number; tier: TierDef; xp: number; xpIntoLevel: number; xpForNext: number; frac: number;
  streak: number; best: number; litToday: boolean; restDays: number;
  tasks: DailyTask[]; tasksDone: number;
  practiceToday: number; practiceCap: number;
  stamps: string[];
}
export interface DailyTask { id: string; label: string; kind: ActivityKind | 'custom'; target: number; done: boolean; progress: number; action?: PanelId | SpotId | ActionId; xp: number }

export interface ProgressApi {
  /** Ghi nhận hoạt động. Trả về tinh tấn nhận được. Phát bus 'progress'. */
  record(kind: ActivityKind, amount?: number, meta?: { spot?: SpotId }): { xp: number; levelUp?: number; stamp?: string[] };
  view(): ProgressView;
  /** Mở khoá theo cấp: trả cấp tối thiểu để dùng một tính năng. */
  unlockLevel(feature: UnlockFeature): number;
  isUnlocked(feature: UnlockFeature): boolean;
  onChange(fn: (v: ProgressView) => void): () => void;
  /** Dữ liệu thô để đồng bộ lên máy chủ/khôi phục. */
  exportState(): unknown;
  importState(state: unknown): void;
}
export type UnlockFeature = 'flowers' | 'bell' | 'candle' | 'lantern' | 'today' | 'dharma' | 'wardrobe' | 'walkMeditation' | 'que' | 'release' | 'loc' | 'friends';

// ───────────────────────── Mạng nhiều người ─────────────────────────
export interface RoomInfo { id: string; label: string; online: number; capacity: number; kind: 'public' | 'private' }
export type ChatScope = 'global' | 'bubble';
export interface ChatMessage {
  id: string;
  senderId: string;
  name: string;
  level: number;
  text: string;
  ts: number;
  scope?: ChatScope;
}
export interface NetEvents extends Record<string, unknown> {
  status: { state: 'offline' | 'connecting' | 'online'; room?: RoomInfo };
  players: RemotePlayer[];
  say: { id: string; text: string };
  chat: ChatMessage;
  lantern: { id: string; color: string; by: string };
  count: { online: number };
  notice: { text: string };
  music: { tracks: MusicTrack[]; startedAt: number; serverNow: number };
}
export interface NetApi extends Emitter<NetEvents> {
  connect(profile: Profile, level: number, roomId?: string): void;
  disconnect(): void;
  lobby(): Promise<RoomInfo[]>;
  joinRoom(roomId: string): void;
  createPrivateRoom(): Promise<RoomInfo | null>;
  sendMove(m: { x: number; z: number; ry: number; anim: RemotePlayer['anim'] }): void;
  sendSay(phraseId: string): void;
  sendChat(text: string, scope?: ChatScope): void;
  sendLantern(color: string): void;
  sendProfile(profile: Profile, level: number): void;
  sendAuth?(token: string | null): void;
  room(): RoomInfo | null;
  selfId?(): string | null;
  isOnline(): boolean;
}

// ───────────────────────── UI ─────────────────────────
export type PanelId =
  | 'journey' | 'rank' | 'beads' | 'chant' | 'meditate' | 'dharma' | 'today' | 'wardrobe'
  | 'lantern' | 'que' | 'wish' | 'rooms' | 'settings' | 'feedback' | 'account' | 'share' | 'friends' | 'install' | 'sayings' | 'listen' | 'walkMeditation';

export interface AppContext {
  profile: Profile;
  setProfile(p: Profile): void;
  world: World;
  audio: AudioApi;
  net: NetApi;
  progress: ProgressApi;
  bus: Emitter<AppEvents>;
  toast(text: string, opts?: { kind?: 'info' | 'good' | 'warn'; ms?: number }): void;
  openPanel(id: PanelId, params?: Record<string, unknown>): Promise<void>;
  closePanel(): void;
  isLoggedIn(): boolean;
  /** Chế độ tịnh tâm một mình (tạm ẩn người chơi khác và Phật tử ảo). */
  isSolo?(): boolean;
  setSolo?(solo: boolean): void;
  /** Thời điểm (ms) hương/hoa/nến còn cháy. */
  offerings(): { incenseUntil: number; flowersUntil: number; candleUntil: number };
}
export interface AppEvents extends Record<string, unknown> {
  progress: ProgressView;
  panel: { id: PanelId | null };
  profile: Profile;
  toast: { text: string };
  levelUp: { level: number; tier: TierDef };
  offerings: { incenseUntil: number; flowersUntil: number; candleUntil: number };
  auth: { loggedIn: boolean; email?: string };
  solo: { solo: boolean };
  chatToggle: { open?: boolean; focus?: boolean };
}

/** Mỗi panel ở src/ui/panels/<id>.ts export `panel`. */
export interface PanelDef {
  id: PanelId;
  title: string;
  /** 'view' = toàn màn hình có nút "Quay lại chùa"; 'dialog' = hộp thoại nổi. */
  kind: 'view' | 'dialog';
  mount(root: HTMLElement, ctx: AppContext, params?: Record<string, unknown>): void | (() => void) | Promise<void | (() => void)>;
}

export const DAY_MS = 86_400_000;
/** Giờ Việt Nam (UTC+7). Dùng cho "ngày" của chuỗi giữ lửa và lịch âm. */
export const VN_OFFSET_MS = 7 * 3_600_000;
