/** Màu đèn hoa đăng và các lời nguyện ngắn để chọn khi thả đèn. */
export const LANTERN_COLORS: { id: string; name: string; hex: string; meaning: string }[] = [
  { id: 'vang', name: 'Vàng', hex: '#f3c25a', meaning: 'Ánh sáng trí tuệ, mong tâm luôn sáng suốt.' },
  { id: 'hong-sen', name: 'Hồng sen', hex: '#eba9bb', meaning: 'Lòng từ bi, mong yêu thương lan tỏa.' },
  { id: 'trang', name: 'Trắng', hex: '#f4efe4', meaning: 'Sự thanh tịnh, mong tâm trong như nước.' },
  { id: 'do', name: 'Đỏ', hex: '#d9503f', meaning: 'Niềm vui và sức sống, mong gặp nhiều duyên lành.' },
  { id: 'xanh-ngoc', name: 'Xanh ngọc', hex: '#5fb59a', meaning: 'Sự bình an, mong thân tâm nhẹ nhõm.' },
  { id: 'tim', name: 'Tím', hex: '#9a82c4', meaning: 'Lòng biết ơn, mong nhớ ơn cha mẹ, thầy bạn.' },
];

export const LANTERN_INTENTS: string[] = ['Bình an', 'Biết ơn', 'Từ bi', 'Hiếu hạnh', 'Tỉnh thức', 'Hỷ xả'];
