// Danh sách "giọng" niệm Phật cho radio (UI chọn theo `id`, truyền vào `setChantRadio(on, id)`).

export interface ChantVoiceInfo {
  id: string;
  name: string;
  desc: string;
}

export const CHANT_VOICES: ChantVoiceInfo[] = [
  { id: 'nam-tram', name: 'Nam trầm', desc: 'Giọng nam trầm ấm, đều đặn theo nhịp mõ.' },
  { id: 'nu-trong', name: 'Nữ trong', desc: 'Giọng nữ cao, trong và nhẹ nhàng.' },
  { id: 'hop-xuong', name: 'Hợp xướng', desc: 'Nhiều giọng cùng niệm, vang vọng như trong chánh điện.' },
  { id: 'chuong-mo', name: 'Chuông mõ', desc: 'Chỉ có tiếng mõ, chuông và nền êm — không lời.' },
];

export const DEFAULT_CHANT_VOICE = 'nam-tram';
