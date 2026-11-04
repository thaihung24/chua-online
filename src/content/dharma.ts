/**
 * Gợi ý pháp thoại. Chỉ dùng đường dẫn TÌM KIẾM YouTube (không chỉ định video cụ thể)
 * nên người nghe tự chọn bài phù hợp. `minutes` là thời lượng tham khảo thường gặp.
 */
export interface DharmaTalk {
  id: string; title: string; speaker: string; channel: string; minutes: number; desc: string; url: string;
  group: 'Cho người mới' | 'Đời sống' | 'Tịnh độ' | 'Thiền';
}

const yt = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

export const DHARMA: DharmaTalk[] = [
  { id: 'nguoi-moi-phat-phap', title: 'Phật pháp căn bản cho người mới', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 30, group: 'Cho người mới',
    desc: 'Làm quen với Tam bảo, Tứ diệu đế, Bát chánh đạo bằng lời giảng dễ hiểu.', url: yt('Phật pháp căn bản cho người mới học Phật') },
  { id: 'nguoi-moi-tam-bao', title: 'Quy y Tam bảo nghĩa là gì?', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 25, group: 'Cho người mới',
    desc: 'Giải thích ý nghĩa nương tựa Phật, Pháp, Tăng và cách giữ tâm quy y.', url: yt('ý nghĩa quy y Tam bảo pháp thoại') },
  { id: 'nguoi-moi-nhan-qua', title: 'Nhân quả cho người bận rộn', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 28, group: 'Cho người mới',
    desc: 'Hiểu luật nhân quả như lời nhắc sống tử tế hơn mỗi ngày, không phải nỗi sợ.', url: yt('pháp thoại nhân quả nghiệp báo dễ hiểu') },
  { id: 'nguoi-moi-lay-phat', title: 'Cách lạy Phật và giữ oai nghi', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 15, group: 'Cho người mới',
    desc: 'Hướng dẫn cơ bản về tư thế lạy Phật, chắp tay và giữ tâm khi vào chùa.', url: yt('hướng dẫn cách lạy Phật đúng cách') },

  { id: 'doi-song-hieu-thao', title: 'Hiếu hạnh và lòng biết ơn cha mẹ', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 30, group: 'Đời sống',
    desc: 'Những bài giảng về chữ hiếu theo tinh thần Vu Lan, nhắc ta trân trọng người thân.', url: yt('pháp thoại hiếu hạnh báo hiếu cha mẹ Vu Lan') },
  { id: 'doi-song-an-lac', title: 'Sống an lạc giữa đời thường', speaker: 'Thích Nhất Hạnh', channel: 'YouTube (tìm kiếm)', minutes: 35, group: 'Đời sống',
    desc: 'Pháp thoại về hơi thở, bước chân và nụ cười tỉnh thức trong sinh hoạt hằng ngày.', url: yt('Thích Nhất Hạnh pháp thoại sống an lạc') },
  { id: 'doi-song-gian', title: 'Chuyển hóa cơn giận', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 25, group: 'Đời sống',
    desc: 'Cách nhận diện và ôm ấp cơn giận bằng hơi thở trước khi nói hay làm điều hối tiếc.', url: yt('pháp thoại chuyển hóa cơn giận') },
  { id: 'doi-song-buong-bo', title: 'Biết buông bỏ để nhẹ lòng', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 30, group: 'Đời sống',
    desc: 'Nói về vô thường, buông bỏ chấp trước và học cách sống nhẹ nhàng hơn.', url: yt('pháp thoại buông bỏ vô thường') },
  { id: 'doi-song-gia-dinh', title: 'Phật pháp trong gia đình', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 30, group: 'Đời sống',
    desc: 'Gợi ý nuôi dưỡng hạnh phúc gia đình bằng lời nói ái ngữ và sự lắng nghe.', url: yt('pháp thoại Phật pháp trong gia đình hạnh phúc') },

  { id: 'tinh-do-a-di-da', title: 'Giảng giải Kinh A Di Đà', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 40, group: 'Tịnh độ',
    desc: 'Đi qua từng đoạn kinh, hiểu lời nguyện của Đức Phật A Di Đà và cõi Cực Lạc.', url: yt('giảng giải Kinh A Di Đà') },
  { id: 'tinh-do-niem-phat', title: 'Pháp môn niệm Phật căn bản', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 30, group: 'Tịnh độ',
    desc: 'Cách niệm Phật nhiếp tâm, nhớ Phật trong đi đứng nằm ngồi.', url: yt('pháp môn niệm Phật Tịnh độ căn bản') },
  { id: 'tinh-do-quan-am', title: 'Hạnh nguyện Quan Thế Âm Bồ Tát', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 30, group: 'Tịnh độ',
    desc: 'Tìm hiểu hạnh lắng nghe tiếng kêu khổ của thế gian qua Phẩm Phổ Môn.', url: yt('giảng Phẩm Phổ Môn Quan Thế Âm Bồ Tát') },
  { id: 'tinh-do-dia-tang', title: 'Hạnh nguyện Địa Tạng Bồ Tát', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 30, group: 'Tịnh độ',
    desc: 'Bài giảng về đại nguyện cứu độ chúng sinh và lòng hiếu của ngài Địa Tạng.', url: yt('giảng Kinh Địa Tạng Bồ Tát bổn nguyện') },

  { id: 'thien-ngoi-thien', title: 'Hướng dẫn ngồi thiền cơ bản', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 20, group: 'Thiền',
    desc: 'Tư thế ngồi, cách theo dõi hơi thở và xử lý khi tâm tán loạn.', url: yt('hướng dẫn ngồi thiền cơ bản cho người mới') },
  { id: 'thien-tho', title: 'Thiền hơi thở và thân thể', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 25, group: 'Thiền',
    desc: 'Buổi hướng dẫn nghe nhẹ nhàng giúp thả lỏng thân và quay về với hơi thở.', url: yt('thiền hơi thở hướng dẫn thiền quán thân') },
  { id: 'thien-di', title: 'Thiền hành — mỗi bước một bình an', speaker: 'Thích Nhất Hạnh', channel: 'YouTube (tìm kiếm)', minutes: 20, group: 'Thiền',
    desc: 'Cách đi thiền chậm rãi, phối hợp bước chân với hơi thở.', url: yt('Thích Nhất Hạnh thiền hành hướng dẫn') },
  { id: 'thien-niem-ngu', title: 'Thiền buổi tối giúp dễ ngủ', speaker: 'Nhiều giảng sư', channel: 'YouTube (tìm kiếm)', minutes: 20, group: 'Thiền',
    desc: 'Bài hướng dẫn thiền thư giãn trước giờ ngủ, thả bớt lo toan trong ngày.', url: yt('hướng dẫn thiền buông thư trước khi ngủ') },
];
