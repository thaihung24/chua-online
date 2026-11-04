/** Dữ liệu kinh GIẢ chỉ dùng cho harness U2 khi src/content/kinh.ts chưa xong (không dùng trong ứng dụng). */
export interface Sutra {
  id: string; group: 'Thời khóa' | 'Chú' | 'Kệ & sám nguyện'; title: string; subtitle: string; blurb: string;
  lines: string[]; source: string; slug: string; minutes: number;
}
const mk = (id: string, group: Sutra['group'], title: string, subtitle: string, lines: string[], minutes: number): Sutra => ({
  id, group, title, subtitle, blurb: 'Bài thử cho harness: nội dung giả để kiểm tra giao diện trình đọc.', lines, source: 'mock', slug: id, minutes,
});
const L = [
  'Nam mô A Di Đà Phật', 'Thân tâm thường an lạc', 'Mười phương ba đời Phật', 'A Di Đà đệ nhất',
  'Chín phẩm độ chúng sanh', 'Oai đức không cùng tận', 'Con nay xin quy mạng', 'Sám hối cả ba nghiệp',
  'Phước lành đều hồi hướng', 'Nguyện sanh về Tây Phương', 'Cùng tất cả chúng sanh', 'Đồng thành tựu Phật đạo',
];
export const SUTRAS: Sutra[] = [
  mk('bat-nha-tam-kinh', 'Thời khóa', 'Bát Nhã Tâm Kinh (thử)', 'Tâm Kinh · bản thử', L, 3),
  mk('kinh-a-di-da', 'Thời khóa', 'Kinh A Di Đà (thử)', 'Bản thử cho harness', L.slice(0, 8), 25),
  mk('ke-hoi-huong', 'Kệ & sám nguyện', 'Kệ Hồi Hướng (thử)', 'Bốn câu kệ', L.slice(8), 1),
  mk('chu-dai-bi', 'Chú', 'Chú Đại Bi (thử)', 'Thần chú', L.slice(0, 6), 8),
];
export const SESSION_PLAN: string[] = ['bat-nha-tam-kinh', 'ke-hoi-huong'];
export const DEDICATION: string[] = ['Nguyện đem công đức này', 'Hướng về khắp tất cả', 'Đệ tử và chúng sanh', 'Đều trọn thành Phật đạo'];
export const getSutra = (id: string): Sutra | undefined => SUTRAS.find((s) => s.id === id);
