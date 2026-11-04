/** Câu chào hỏi soạn sẵn (người chơi chỉ chọn, không gõ tự do). */
export interface Phrase { id: string; group: string; text: string }

export const PHRASE_GROUPS = ['Chào hỏi', 'Tùy hỷ', 'Cầu nguyện', 'Cảm ơn', 'Rủ công phu'] as const;

export const PHRASES: Phrase[] = [
  { id: 'chao-adidaphat', group: 'Chào hỏi', text: 'A Di Đà Phật' },
  { id: 'chao-namo', group: 'Chào hỏi', text: 'Nam mô A Di Đà Phật' },
  { id: 'chao-xin-chao', group: 'Chào hỏi', text: 'Xin chào mọi người' },
  { id: 'chao-binhan', group: 'Chào hỏi', text: 'Chúc bình an' },
  { id: 'chao-anlac', group: 'Chào hỏi', text: 'Chúc mọi người một ngày an lạc' },
  { id: 'chao-sang', group: 'Chào hỏi', text: 'Chào buổi sáng, chúc mọi người nhẹ nhàng' },
  { id: 'chao-toi', group: 'Chào hỏi', text: 'Chào buổi tối, chúc mọi người ngủ ngon' },
  { id: 'chao-moi-den', group: 'Chào hỏi', text: 'Mình mới đến, rất vui được gặp mọi người' },
  { id: 'chao-hen-gap', group: 'Chào hỏi', text: 'Hẹn gặp lại mọi người' },
  { id: 'chao-tam-biet', group: 'Chào hỏi', text: 'Mình xin phép về nghỉ, chúc mọi người bình an' },
  { id: 'chao-moi-vui', group: 'Chào hỏi', text: 'Chào bạn đạo, rất hoan hỷ' },
  { id: 'chao-ngay-lanh', group: 'Chào hỏi', text: 'Chúc mọi người ngày lành' },

  { id: 'tuyhy-tuyhy', group: 'Tùy hỷ', text: 'Tùy hỷ công đức' },
  { id: 'tuyhy-lanh', group: 'Tùy hỷ', text: 'Lành thay, tùy hỷ với bạn' },
  { id: 'tuyhy-sadhu', group: 'Tùy hỷ', text: 'Thiện tai, thiện tai' },
  { id: 'tuyhy-giu-lua', group: 'Tùy hỷ', text: 'Tùy hỷ chuỗi giữ lửa của bạn' },
  { id: 'tuyhy-den', group: 'Tùy hỷ', text: 'Chiếc đèn hoa đăng thật đẹp, tùy hỷ' },
  { id: 'tuyhy-tinhtan', group: 'Tùy hỷ', text: 'Bạn thật tinh tấn, mình xin học theo' },

  { id: 'nguyen-anlac', group: 'Cầu nguyện', text: 'Nguyện cho mọi người thân tâm an lạc' },
  { id: 'nguyen-gia-dinh', group: 'Cầu nguyện', text: 'Nguyện cho gia đình mọi người bình an' },
  { id: 'nguyen-chung-sinh', group: 'Cầu nguyện', text: 'Nguyện cho tất cả chúng sinh được an vui' },
  { id: 'nguyen-hoi-huong', group: 'Cầu nguyện', text: 'Nguyện đem công đức này hướng về khắp tất cả' },
  { id: 'nguyen-khoe', group: 'Cầu nguyện', text: 'Nguyện cho người đang đau ốm sớm được nhẹ nhàng' },
  { id: 'nguyen-hoa-binh', group: 'Cầu nguyện', text: 'Nguyện thế giới hòa bình' },

  { id: 'camon-camon', group: 'Cảm ơn', text: 'Cảm ơn bạn' },
  { id: 'camon-dong-hanh', group: 'Cảm ơn', text: 'Cảm ơn mọi người đã cùng đồng hành' },
  { id: 'camon-chia-se', group: 'Cảm ơn', text: 'Cảm ơn bạn đã chia sẻ' },
  { id: 'camon-chi-duong', group: 'Cảm ơn', text: 'Cảm ơn bạn đã chỉ đường giúp mình' },
  { id: 'camon-phat', group: 'Cảm ơn', text: 'Cảm ơn Phật, cảm ơn cuộc đời' },
  { id: 'camon-ngay-nay', group: 'Cảm ơn', text: 'Biết ơn một ngày bình yên' },

  { id: 'ru-niem-phat', group: 'Rủ công phu', text: 'Mình cùng niệm Phật nhé' },
  { id: 'ru-tung-kinh', group: 'Rủ công phu', text: 'Mình cùng tụng kinh nhé' },
  { id: 'ru-ngoi-thien', group: 'Rủ công phu', text: 'Mình cùng ngồi thiền nhé' },
  { id: 'ru-thap-huong', group: 'Rủ công phu', text: 'Mình cùng thắp nén hương nhé' },
  { id: 'ru-tha-den', group: 'Rủ công phu', text: 'Mình cùng thả đèn hoa đăng nhé' },
  { id: 'ru-quet-la', group: 'Rủ công phu', text: 'Mình cùng quét lá sân chùa nhé' },
  { id: 'ru-di-dao', group: 'Rủ công phu', text: 'Mình cùng đi dạo một vòng nhé' },
  { id: 'ru-ba-hoi-tho', group: 'Rủ công phu', text: 'Mình cùng thở ba hơi thật chậm nhé' },
];

export function phraseText(id: string): string | undefined {
  return PHRASES.find((p) => p.id === id)?.text;
}
