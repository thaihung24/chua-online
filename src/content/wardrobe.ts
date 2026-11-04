/** Phụ kiện mở khoá theo cấp. id khớp src/world/avatar/accessories.ts (W2). */
export interface Accessory { id: string; name: string; minLevel: number; desc: string; kind: 'hat' | 'neck' | 'hand' | 'back' }

export const ACCESSORIES: Accessory[] = [
  { id: 'conical-hat', name: 'Nón lá', minLevel: 2, kind: 'hat', desc: 'Chiếc nón lá giản dị, che nắng cho những buổi đi chùa đường xa.' },
  { id: 'hat-tram', name: 'Tràng hạt trầm', minLevel: 3, kind: 'neck', desc: 'Chuỗi hạt gỗ trầm thơm dịu, đeo nơi cổ để nhớ câu niệm Phật.' },
  { id: 'bag-brocade', name: 'Túi thổ cẩm', minLevel: 4, kind: 'back', desc: 'Chiếc túi vải thổ cẩm nhiều sắc màu, đựng kinh sách và tâm nguyện.' },
  { id: 'lotus-hand', name: 'Hoa sen cầm tay', minLevel: 5, kind: 'hand', desc: 'Một đóa sen hồng nâng trên tay, dâng lên Phật với lòng thanh tịnh.' },
  { id: 'scarf-gold', name: 'Khăn vàng', minLevel: 6, kind: 'neck', desc: 'Chiếc khăn màu vàng nắng, ấm áp như lời chúc bình an.' },
  { id: 'bracelet-jade', name: 'Vòng ngọc', minLevel: 8, kind: 'hand', desc: 'Vòng ngọc xanh trong, nhắc mình giữ tâm mát lành, nhẹ nhàng.' },
  { id: 'halo-lotus', name: 'Hào quang sen', minLevel: 30, kind: 'hat', desc: 'Vầng sáng cánh sen phía sau đầu — dấu ấn của một chặng tu tập bền bỉ.' },
];

export function getAccessory(id: string): Accessory | undefined {
  return ACCESSORIES.find((a) => a.id === id);
}
