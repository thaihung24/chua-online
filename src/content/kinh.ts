/**
 * Kinh văn & bài tụng (văn bản công cộng, bản Hán-Việt phổ biến).
 * Các bài được chép lại từ bản tụng phổ biến; mỗi chùa có thể có dị bản nhỏ.
 * Trường `source` ghi trung thực mức độ đối chiếu. Chưa qua chư tăng duyệt.
 */
export interface Sutra {
  id: string;
  group: 'Thời khóa' | 'Chú' | 'Kệ & sám nguyện';
  title: string;
  subtitle: string;
  blurb: string;
  /** Mỗi phần tử = một câu/ý ngắn; UI tách theo khoảng trắng để gõ mõ từng chữ. */
  lines: string[];
  source: string;
  slug: string;
  minutes: number;
}

const MAX_WORDS = 14;
const wc = (s: string) => s.split(/\s+/).filter(Boolean).length;

/** Tách đoạn văn thành các câu ngắn theo nhịp tụng (ngắt ở dấu câu, gộp mệnh đề quá ngắn). */
export function chia(text: string): string[] {
  const out: string[] = [];
  for (const para of text.split('\n')) {
    const clauses = para.match(/[^,;:.!?]+[,;:.!?]*/g) ?? [];
    let cur = '';
    const flush = () => {
      const t = cur.trim();
      if (t) out.push(...hardSplit(t));
      cur = '';
    };
    for (const raw of clauses) {
      const c = raw.trim();
      if (!c) continue;
      if (cur && wc(cur) + wc(c) > 12) flush();
      cur = cur ? `${cur} ${c}` : c;
      if (/[.!?:]$/.test(c) || (/[,;]$/.test(c) && wc(cur) >= 7)) flush();
    }
    flush();
  }
  return out;
}

function hardSplit(t: string): string[] {
  const w = t.split(/\s+/);
  if (w.length <= MAX_WORDS) return [t];
  const parts = Math.ceil(w.length / MAX_WORDS);
  const size = Math.ceil(w.length / parts);
  const res: string[] = [];
  for (let i = 0; i < w.length; i += size) res.push(w.slice(i, i + size).join(' '));
  return res;
}

/** Ghép từng cặp nửa câu kệ (ngăn bằng "/") thành một dòng. */
function ke(text: string): string[] {
  const halves = text.split('/').map((s) => s.trim()).filter(Boolean);
  const res: string[] = [];
  for (let i = 0; i < halves.length; i += 2) res.push(halves.slice(i, i + 2).join(' '));
  return res;
}

const mins = (lines: string[]) => Math.max(1, Math.round(lines.join(' ').split(/\s+/).length / 80));

type Def = Omit<Sutra, 'slug' | 'minutes'>;
const mk = (d: Def): Sutra => ({ ...d, slug: d.id, minutes: mins(d.lines) });

const SRC_COMMON = 'Bản Hán-Việt phổ biến, đối chiếu từ nhiều bản tụng; chưa qua chư tăng duyệt, có thể khác đôi chữ so với bản ở từng chùa.';

const KHAI_KINH = mk({
  id: 'ke-khai-kinh', group: 'Thời khóa', title: 'Kệ Khai Kinh', subtitle: 'Bài kệ mở đầu buổi tụng',
  blurb: 'Bốn câu kệ phát nguyện hiểu đúng nghĩa lời Phật dạy, thường tụng trước khi vào kinh.',
  lines: [
    'Vô thượng thậm thâm vi diệu pháp,',
    'Bá thiên vạn kiếp nan tao ngộ,',
    'Ngã kim kiến văn đắc thọ trì,',
    'Nguyện giải Như Lai chơn thật nghĩa.',
  ],
  source: SRC_COMMON,
});

const TAM_TU_QUY = mk({
  id: 'tam-tu-quy', group: 'Thời khóa', title: 'Tam Tự Quy', subtitle: 'Quy y Phật, Pháp, Tăng',
  blurb: 'Ba lời nương tựa Phật, Pháp, Tăng, kèm lời nguyện hướng tới chúng sinh.',
  lines: [
    'Tự quy y Phật,',
    'Đương nguyện chúng sanh,',
    'Thể giải đại đạo,',
    'Phát vô thượng tâm.',
    'Tự quy y Pháp,',
    'Đương nguyện chúng sanh,',
    'Thâm nhập kinh tạng,',
    'Trí huệ như hải.',
    'Tự quy y Tăng,',
    'Đương nguyện chúng sanh,',
    'Thống lý đại chúng,',
    'Nhất thiết vô ngại.',
    'Hòa nam thánh chúng.',
  ],
  source: SRC_COMMON,
});

const KE_SAM_HOI = mk({
  id: 'ke-sam-hoi', group: 'Thời khóa', title: 'Kệ Sám Hối', subtitle: 'Nhìn lại, buông xuống, làm lại',
  blurb: 'Bài kệ nhận ra lỗi lầm sinh từ tham, sân, si và phát tâm sám hối để làm lại từ đầu.',
  lines: [
    'Vãng tích sở tạo chư ác nghiệp,',
    'Giai do vô thỉ tham sân si,',
    'Tùng thân ngữ ý chi sở sanh,',
    'Nhất thiết ngã kim giai sám hối.',
  ],
  source: SRC_COMMON,
});

const TAM_KINH = mk({
  id: 'bat-nha-tam-kinh', group: 'Thời khóa', title: 'Bát Nhã Ba La Mật Đa Tâm Kinh', subtitle: 'Tâm Kinh · bản Hán-Việt',
  blurb: 'Bản kinh ngắn nói về trí tuệ Bát Nhã và tánh Không: không bám chấp thì không còn sợ hãi.',
  lines: chia(`Quán Tự Tại Bồ Tát, hành thâm Bát Nhã Ba La Mật Đa thời, chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách.
Xá Lợi Tử! Sắc bất dị không, không bất dị sắc; sắc tức thị không, không tức thị sắc; thọ tưởng hành thức, diệc phục như thị.
Xá Lợi Tử! Thị chư pháp không tướng, bất sanh bất diệt, bất cấu bất tịnh, bất tăng bất giảm.
Thị cố không trung, vô sắc, vô thọ tưởng hành thức; vô nhãn nhĩ tỷ thiệt thân ý; vô sắc thanh hương vị xúc pháp; vô nhãn giới, nãi chí vô ý thức giới; vô vô minh, diệc vô vô minh tận, nãi chí vô lão tử, diệc vô lão tử tận; vô khổ tập diệt đạo; vô trí diệc vô đắc.
Dĩ vô sở đắc cố, Bồ đề tát đỏa y Bát Nhã Ba La Mật Đa cố, tâm vô quái ngại; vô quái ngại cố, vô hữu khủng bố, viễn ly điên đảo mộng tưởng, cứu cánh Niết Bàn.
Tam thế chư Phật, y Bát Nhã Ba La Mật Đa cố, đắc A nậu đa la tam miệu tam bồ đề.
Cố tri Bát Nhã Ba La Mật Đa, thị đại thần chú, thị đại minh chú, thị vô thượng chú, thị vô đẳng đẳng chú, năng trừ nhất thiết khổ, chơn thật bất hư.
Cố thuyết Bát Nhã Ba La Mật Đa chú, tức thuyết chú viết:
Yết đế yết đế, Ba la yết đế, Ba la tăng yết đế, Bồ đề tát bà ha.`),
  source: SRC_COMMON + ' Bản dịch của Pháp sư Huyền Trang, âm Hán-Việt thông dụng.',
});

const AM_DA_P1 = `Như thị ngã văn: Nhất thời Phật tại Xá Vệ quốc, Kỳ thụ Cấp Cô Độc viên, dữ đại Tỳ-kheo tăng, thiên nhị bách ngũ thập nhân câu, giai thị đại A-la-hán, chúng sở tri thức: Trưởng lão Xá Lợi Phất, Ma Ha Mục Kiền Liên, Ma Ha Ca Diếp, Ma Ha Ca Chiên Diên, Ma Ha Câu Hy La, Ly Bà Đa, Châu Lợi Bàn Đà Già, Nan Đà, A Nan Đà, La Hầu La, Kiều Phạm Ba Đề, Tân Đầu Lô Phả La Đọa, Ca Lưu Đà Di, Ma Ha Kiếp Tân Na, Bạc Câu La, A Nậu Lâu Đà, như thị đẳng chư đại đệ tử. Tinh chư Bồ Tát Ma Ha Tát: Văn Thù Sư Lợi Pháp Vương Tử, A Dật Đa Bồ Tát, Càn Đà Ha Đề Bồ Tát, Thường Tinh Tấn Bồ Tát, dữ như thị đẳng chư đại Bồ Tát, cập Thích Đề Hoàn Nhân đẳng, vô lượng chư thiên đại chúng câu.
Nhĩ thời Phật cáo Trưởng lão Xá Lợi Phất: Tùng thị Tây phương quá thập vạn ức Phật độ, hữu thế giới danh viết Cực Lạc. Kỳ độ hữu Phật, hiệu A Di Đà, kim hiện tại thuyết pháp.
Xá Lợi Phất! Bỉ độ hà cố danh vi Cực Lạc? Kỳ quốc chúng sanh, vô hữu chúng khổ, đản thọ chư lạc, cố danh Cực Lạc.
Hựu Xá Lợi Phất! Cực Lạc quốc độ, thất trùng lan thuẫn, thất trùng la võng, thất trùng hàng thọ, giai thị tứ bảo, châu táp vi nhiễu, thị cố bỉ quốc danh viết Cực Lạc.
Hựu Xá Lợi Phất! Cực Lạc quốc độ, hữu thất bảo trì, bát công đức thủy, sung mãn kỳ trung, trì để thuần dĩ kim sa bố địa. Tứ biên giai đạo, kim, ngân, lưu ly, pha lê hiệp thành. Thượng hữu lầu các, diệc dĩ kim, ngân, lưu ly, pha lê, xa cừ, xích châu, mã não, nhi nghiêm sức chi. Trì trung liên hoa, đại như xa luân, thanh sắc thanh quang, huỳnh sắc huỳnh quang, xích sắc xích quang, bạch sắc bạch quang, vi diệu hương khiết.
Xá Lợi Phất! Cực Lạc quốc độ, thành tựu như thị công đức trang nghiêm.
Hựu Xá Lợi Phất! Bỉ Phật quốc độ, thường tác thiên nhạc, huỳnh kim vi địa, trú dạ lục thời, vũ thiên mạn đà la hoa. Kỳ độ chúng sanh, thường dĩ thanh đán, các dĩ y kích thịnh chúng diệu hoa, cúng dường tha phương thập vạn ức Phật, tức dĩ thực thời, hoàn đáo bổn quốc, phạn thực kinh hành.
Xá Lợi Phất! Cực Lạc quốc độ, thành tựu như thị công đức trang nghiêm.
Phục thứ Xá Lợi Phất! Bỉ quốc thường hữu chủng chủng kỳ diệu tạp sắc chi điểu: bạch hạc, khổng tước, anh võ, xá lợi, ca lăng tần già, cộng mạng chi điểu. Thị chư chúng điểu, trú dạ lục thời, xuất hòa nhã âm. Kỳ âm diễn xướng ngũ căn, ngũ lực, thất bồ đề phần, bát thánh đạo phần, như thị đẳng pháp. Kỳ độ chúng sanh, văn thị âm dĩ, giai tất niệm Phật, niệm Pháp, niệm Tăng.
Xá Lợi Phất! Nhữ vật vị thử điểu thật thị tội báo sở sanh. Sở dĩ giả hà? Bỉ Phật quốc độ vô tam ác đạo. Xá Lợi Phất! Kỳ Phật quốc độ thượng vô ác đạo chi danh, hà huống hữu thật? Thị chư chúng điểu, giai thị A Di Đà Phật dục linh pháp âm tuyên lưu, biến hóa sở tác.
Xá Lợi Phất! Bỉ Phật quốc độ, vi phong xuy động, chư bảo hàng thọ, cập bảo la võng, xuất vi diệu âm, thí như bá thiên chủng nhạc, đồng thời câu tác. Văn thị âm giả, tự nhiên giai sanh niệm Phật, niệm Pháp, niệm Tăng chi tâm.
Xá Lợi Phất! Kỳ Phật quốc độ, thành tựu như thị công đức trang nghiêm.`;

const AM_DA_P2 = `Xá Lợi Phất! Ư nhữ ý vân hà? Bỉ Phật hà cố hiệu A Di Đà? Xá Lợi Phất! Bỉ Phật quang minh vô lượng, chiếu thập phương quốc, vô sở chướng ngại, thị cố hiệu vi A Di Đà.
Hựu Xá Lợi Phất! Bỉ Phật thọ mạng, cập kỳ nhân dân, vô lượng vô biên A tăng kỳ kiếp, cố danh A Di Đà.
Xá Lợi Phất! A Di Đà Phật thành Phật dĩ lai, ư kim thập kiếp.
Hựu Xá Lợi Phất! Bỉ Phật hữu vô lượng vô biên Thanh văn đệ tử, giai A-la-hán, phi thị toán số chi sở năng tri. Chư Bồ Tát chúng, diệc phục như thị.
Xá Lợi Phất! Bỉ Phật quốc độ, thành tựu như thị công đức trang nghiêm.
Hựu Xá Lợi Phất! Cực Lạc quốc độ, chúng sanh sanh giả, giai thị A bệ bạt trí. Kỳ trung đa hữu nhất sanh bổ xứ, kỳ số thậm đa, phi thị toán số sở năng tri chi, đản khả dĩ vô lượng vô biên A tăng kỳ thuyết.
Xá Lợi Phất! Chúng sanh văn giả, ưng đương phát nguyện, nguyện sanh bỉ quốc. Sở dĩ giả hà? Đắc dữ như thị chư thượng thiện nhân câu hội nhất xứ.
Xá Lợi Phất! Bất khả dĩ thiểu thiện căn phước đức nhân duyên, đắc sanh bỉ quốc.
Xá Lợi Phất! Nhược hữu thiện nam tử, thiện nữ nhân, văn thuyết A Di Đà Phật, chấp trì danh hiệu, nhược nhất nhật, nhược nhị nhật, nhược tam nhật, nhược tứ nhật, nhược ngũ nhật, nhược lục nhật, nhược thất nhật, nhất tâm bất loạn. Kỳ nhân lâm mạng chung thời, A Di Đà Phật, dữ chư Thánh chúng, hiện tại kỳ tiền. Thị nhân chung thời, tâm bất điên đảo, tức đắc vãng sanh A Di Đà Phật Cực Lạc quốc độ.
Xá Lợi Phất! Ngã kiến thị lợi, cố thuyết thử ngôn. Nhược hữu chúng sanh, văn thị thuyết giả, ưng đương phát nguyện, sanh bỉ quốc độ.`;

const CHU_PHAT_TAIL = 'như thị đẳng hằng hà sa số chư Phật, các ư kỳ quốc, xuất quảng trường thiệt tướng, biến phú tam thiên đại thiên thế giới, thuyết thành thật ngôn: Nhữ đẳng chúng sanh, đương tín thị xưng tán bất khả tư nghị công đức, nhất thiết chư Phật sở hộ niệm Kinh.';

const AM_DA_P3 = `Xá Lợi Phất! Như ngã kim giả, tán thán A Di Đà Phật bất khả tư nghị công đức chi lợi. Đông phương diệc hữu A Súc Bệ Phật, Tu Di Tướng Phật, Đại Tu Di Phật, Tu Di Quang Phật, Diệu Âm Phật, ${CHU_PHAT_TAIL}
Xá Lợi Phất! Nam phương thế giới hữu Nhật Nguyệt Đăng Phật, Danh Văn Quang Phật, Đại Diệm Kiên Phật, Tu Di Đăng Phật, Vô Lượng Tinh Tấn Phật, ${CHU_PHAT_TAIL}
Xá Lợi Phất! Tây phương thế giới hữu Vô Lượng Thọ Phật, Vô Lượng Tướng Phật, Vô Lượng Tràng Phật, Đại Quang Phật, Đại Minh Phật, Bảo Tướng Phật, Tịnh Quang Phật, ${CHU_PHAT_TAIL}
Xá Lợi Phất! Bắc phương thế giới hữu Diệm Kiên Phật, Tối Thắng Âm Phật, Nan Trở Phật, Nhật Sanh Phật, Võng Minh Phật, ${CHU_PHAT_TAIL}
Xá Lợi Phất! Hạ phương thế giới hữu Sư Tử Phật, Danh Văn Phật, Danh Quang Phật, Đạt Ma Phật, Pháp Tràng Phật, Trì Pháp Phật, ${CHU_PHAT_TAIL}
Xá Lợi Phất! Thượng phương thế giới hữu Phạm Âm Phật, Tú Vương Phật, Hương Thượng Phật, Hương Quang Phật, Đại Diệm Kiên Phật, Tạp Sắc Bảo Hoa Nghiêm Thân Phật, Ta La Thọ Vương Phật, Bảo Hoa Đức Phật, Kiến Nhất Thiết Nghĩa Phật, Như Tu Di Sơn Phật, ${CHU_PHAT_TAIL}
Xá Lợi Phất! Ư nhữ ý vân hà? Hà cố danh vi nhất thiết chư Phật sở hộ niệm Kinh? Xá Lợi Phất! Nhược hữu thiện nam tử, thiện nữ nhân, văn thị kinh thọ trì giả, cập văn chư Phật danh giả, thị chư thiện nam tử, thiện nữ nhân, giai vi nhất thiết chư Phật chi sở hộ niệm, giai đắc bất thối chuyển ư A nậu đa la tam miệu tam bồ đề. Thị cố Xá Lợi Phất! Nhữ đẳng giai đương tín thọ ngã ngữ, cập chư Phật sở thuyết.
Xá Lợi Phất! Nhược hữu nhân dĩ phát nguyện, kim phát nguyện, đương phát nguyện, dục sanh A Di Đà Phật quốc giả, thị chư nhân đẳng, giai đắc bất thối chuyển ư A nậu đa la tam miệu tam bồ đề, ư bỉ quốc độ, nhược dĩ sanh, nhược kim sanh, nhược đương sanh. Thị cố Xá Lợi Phất! Chư thiện nam tử, thiện nữ nhân, nhược hữu tín giả, ưng đương phát nguyện, sanh bỉ quốc độ.
Xá Lợi Phất! Như ngã kim giả, xưng tán chư Phật bất khả tư nghị công đức, bỉ chư Phật đẳng, diệc xưng tán ngã bất khả tư nghị công đức, nhi tác thị ngôn: Thích Ca Mâu Ni Phật năng vi thậm nan hy hữu chi sự, năng ư Ta Bà quốc độ, ngũ trược ác thế: kiếp trược, kiến trược, phiền não trược, chúng sanh trược, mạng trược trung, đắc A nậu đa la tam miệu tam bồ đề, vị chư chúng sanh, thuyết thị nhất thiết thế gian nan tín chi pháp.
Xá Lợi Phất! Đương tri ngã ư ngũ trược ác thế, hành thử nan sự, đắc A nậu đa la tam miệu tam bồ đề, vị nhất thiết thế gian thuyết thử nan tín chi pháp, thị vi thậm nan.
Phật thuyết thử kinh dĩ, Xá Lợi Phất, cập chư Tỳ-kheo, nhất thiết thế gian, Thiên, Nhân, A-tu-la đẳng, văn Phật sở thuyết, hoan hỷ tín thọ, tác lễ nhi khứ.
Phật thuyết A Di Đà Kinh.`;

const A_DI_DA = mk({
  id: 'kinh-a-di-da', group: 'Thời khóa', title: 'Kinh A Di Đà', subtitle: 'Phật thuyết A Di Đà Kinh · bản Hán-Việt',
  blurb: 'Bộ kinh nền tảng của pháp môn Tịnh độ: Đức Phật giới thiệu cõi Cực Lạc và khuyên phát nguyện niệm Phật.',
  lines: [
    'Phật thuyết A Di Đà Kinh.',
    'Diêu Tần Tam Tạng Pháp Sư Cưu Ma La Thập phụng chiếu dịch.',
    ...chia(AM_DA_P1), ...chia(AM_DA_P2), ...chia(AM_DA_P3),
  ],
  source: 'Bản Hán-Việt phổ biến (Cưu Ma La Thập dịch), chép đầy đủ từ bản tụng thông dụng; đối chiếu từ nhiều nguồn nhưng chưa qua chư tăng duyệt — nếu có chữ khác bản chùa bạn tụng, xin theo bản chùa.',
});

const THAN_QB = [
  'Phật', 'Bích Chi Phật', 'Thanh Văn', 'Phạm Vương', 'Đế Thích', 'Tự Tại Thiên', 'Đại Tự Tại Thiên', 'Thiên Đại Tướng Quân',
  'Tỳ Sa Môn', 'Tiểu Vương', 'Trưởng giả', 'Cư sĩ', 'Tể quan', 'Bà La Môn', 'Tỳ-kheo, Tỳ-kheo ni, Ưu-bà-tắc, Ưu-bà-di',
  'phụ nữ của trưởng giả, cư sĩ, tể quan, Bà La Môn', 'đồng nam, đồng nữ',
  'Thiên, Long, Dạ xoa, Càn thát bà, A tu la, Ca lâu la, Khẩn na la, Ma hầu la già, Nhân phi nhân đẳng', 'Chấp Kim Cang thần',
];
const HIEN_THAN = THAN_QB.map((t) => `ưng dĩ ${t} thân đắc độ giả, Quán Thế Âm Bồ Tát tức hiện ${t} thân nhi vị thuyết pháp;`).join('\n');

const PHO_MON_P1 = `Phẩm thứ hai mươi lăm: Quán Thế Âm Bồ Tát Phổ Môn.
Nhĩ thời, Vô Tận Ý Bồ Tát, tức tùng tòa khởi, thiên đản hữu kiên, hiệp chưởng hướng Phật, nhi tác thị ngôn: Thế Tôn! Quán Thế Âm Bồ Tát, dĩ hà nhân duyên, danh Quán Thế Âm?
Phật cáo Vô Tận Ý Bồ Tát: Thiện nam tử! Nhược hữu vô lượng bá thiên vạn ức chúng sanh, thọ chư khổ não, văn thị Quán Thế Âm Bồ Tát, nhất tâm xưng danh, Quán Thế Âm Bồ Tát tức thời quán kỳ âm thanh, giai đắc giải thoát.
Nhược hữu trì thị Quán Thế Âm Bồ Tát danh giả, thiết nhập đại hỏa, hỏa bất năng thiêu, do thị Bồ Tát oai thần lực cố.
Nhược vị đại thủy sở phiêu, xưng kỳ danh hiệu, tức đắc thiển xứ.
Nhược hữu bá thiên vạn ức chúng sanh, vì cầu kim, ngân, lưu ly, xa cừ, mã não, san hô, hổ phách, chân châu đẳng bảo, nhập ư đại hải, giả sử hắc phong xuy kỳ thuyền phưởng, phiêu đọa La sát quỷ quốc, kỳ trung nhược hữu nãi chí nhất nhân, xưng Quán Thế Âm Bồ Tát danh giả, thị chư nhân đẳng, giai đắc giải thoát La sát chi nạn. Dĩ thị nhân duyên, danh Quán Thế Âm.
Nhược phục hữu nhân, lâm đương bị hại, xưng Quán Thế Âm Bồ Tát danh giả, bỉ sở chấp đao trượng, tầm đoạn đoạn hoại, nhi đắc giải thoát.
Nhược tam thiên đại thiên quốc độ, mãn trung Dạ xoa La sát, dục lai não nhân, văn kỳ xưng Quán Thế Âm Bồ Tát danh giả, thị chư ác quỷ, thượng bất năng dĩ ác nhãn thị chi, huống phục gia hại.
Thiết phục hữu nhân, nhược hữu tội, nhược vô tội, nữu giới già tỏa, kiểm hệ kỳ thân, xưng Quán Thế Âm Bồ Tát danh giả, giai tất đoạn hoại, tức đắc giải thoát.
Nhược tam thiên đại thiên quốc độ, mãn trung oán tặc, hữu nhất thương chủ, tương chư thương nhân, tê trì trọng bảo, kinh quá hiểm lộ, kỳ trung nhất nhân, tác thị xướng ngôn: Chư thiện nam tử! Vật đắc khủng bố, nhữ đẳng ưng đương nhất tâm xưng Quán Thế Âm Bồ Tát danh hiệu, thị Bồ Tát năng dĩ vô úy thí ư chúng sanh, nhữ đẳng nhược xưng danh giả, ư thử oán tặc, đương đắc giải thoát. Chúng thương nhân văn, câu phát thanh ngôn: Nam mô Quán Thế Âm Bồ Tát! Xưng kỳ danh cố, tức đắc giải thoát.
Vô Tận Ý! Quán Thế Âm Bồ Tát Ma Ha Tát, oai thần chi lực, nguy nguy như thị.
Nhược hữu chúng sanh, đa ư dâm dục, thường niệm cung kính Quán Thế Âm Bồ Tát, tiện đắc ly dục. Nhược đa sân nhuế, thường niệm cung kính Quán Thế Âm Bồ Tát, tiện đắc ly sân. Nhược đa ngu si, thường niệm cung kính Quán Thế Âm Bồ Tát, tiện đắc ly si.
Vô Tận Ý! Quán Thế Âm Bồ Tát, hữu như thị đẳng đại oai thần lực, đa sở nhiêu ích, thị cố chúng sanh, thường ưng tâm niệm.
Nhược hữu nữ nhân, thiết dục cầu nam, lễ bái cúng dường Quán Thế Âm Bồ Tát, tiện sanh phước đức trí huệ chi nam. Thiết dục cầu nữ, tiện sanh đoan chánh hữu tướng chi nữ, túc thực đức bổn, chúng nhân ái kính.
Vô Tận Ý! Quán Thế Âm Bồ Tát, hữu như thị lực. Nhược hữu chúng sanh, cung kính lễ bái Quán Thế Âm Bồ Tát, phước bất đường quyên. Thị cố chúng sanh, giai ưng thọ trì Quán Thế Âm Bồ Tát danh hiệu.
Vô Tận Ý! Nhược hữu nhân, thọ trì lục thập nhị ức hằng hà sa Bồ Tát danh tự, phục tận hình cúng dường ẩm thực, y phục, ngọa cụ, y dược, ư nhữ ý vân hà? Thị thiện nam tử, thiện nữ nhân, công đức đa phủ? Vô Tận Ý ngôn: Thậm đa, Thế Tôn!
Phật ngôn: Nhược phục hữu nhân, thọ trì Quán Thế Âm Bồ Tát danh hiệu, nãi chí nhất thời lễ bái cúng dường, thị nhị nhân phước, chánh đẳng vô dị, ư bá thiên vạn ức kiếp, bất khả cùng tận. Vô Tận Ý! Thọ trì Quán Thế Âm Bồ Tát danh hiệu, đắc như thị vô lượng vô biên phước đức chi lợi.
Vô Tận Ý Bồ Tát bạch Phật ngôn: Thế Tôn! Quán Thế Âm Bồ Tát, vân hà du thử Ta Bà thế giới? Vân hà nhi vị chúng sanh thuyết pháp? Phương tiện chi lực, kỳ sự vân hà?
Phật cáo Vô Tận Ý Bồ Tát: Thiện nam tử! Nhược hữu quốc độ chúng sanh,
${HIEN_THAN}
Vô Tận Ý! Thị Quán Thế Âm Bồ Tát, thành tựu như thị công đức, dĩ chủng chủng hình, du chư quốc độ, độ thoát chúng sanh. Thị cố nhữ đẳng, ưng đương nhất tâm cúng dường Quán Thế Âm Bồ Tát. Thị Quán Thế Âm Bồ Tát Ma Ha Tát, ư bố úy cấp nạn chi trung, năng thí vô úy, thị cố thử Ta Bà thế giới, giai hiệu chi vi Thí Vô Úy Giả.
Vô Tận Ý Bồ Tát bạch Phật ngôn: Thế Tôn! Ngã kim đương cúng dường Quán Thế Âm Bồ Tát. Tức giải cảnh chúng bảo châu anh lạc, giá trị bá thiên lượng kim, nhi dĩ dữ chi, tác thị ngôn: Nhân giả! Thọ thử pháp thí, trân bảo anh lạc. Thời Quán Thế Âm Bồ Tát bất khẳng thọ chi.
Vô Tận Ý phục bạch Quán Thế Âm Bồ Tát ngôn: Nhân giả! Mẫn ngã đẳng cố, thọ thử anh lạc. Nhĩ thời Phật cáo Quán Thế Âm Bồ Tát: Đương mẫn thử Vô Tận Ý Bồ Tát, cập tứ chúng, Thiên, Long, Dạ xoa, Càn thát bà, A tu la, Ca lâu la, Khẩn na la, Ma hầu la già, Nhân phi nhân đẳng cố, thọ thị anh lạc.
Tức thời Quán Thế Âm Bồ Tát mẫn chư tứ chúng, cập ư Thiên, Long, Nhân phi nhân đẳng, thọ kỳ anh lạc, phân tác nhị phần, nhất phần phụng Thích Ca Mâu Ni Phật, nhất phần phụng Đa Bảo Phật tháp.
Vô Tận Ý! Quán Thế Âm Bồ Tát hữu như thị tự tại thần lực, du ư Ta Bà thế giới.
Nhĩ thời Vô Tận Ý Bồ Tát, dĩ kệ vấn viết:`;

const PHO_MON_KE = ke(`Thế Tôn diệu tướng cụ, / Ngã kim trùng vấn bỉ, / Phật tử hà nhân duyên, / Danh vi Quán Thế Âm. /
Cụ túc diệu tướng tôn, / Kệ đáp Vô Tận Ý: / Nhữ thính Quán Âm hạnh, / Thiện ứng chư phương sở. /
Hoằng thệ thâm như hải, / Lịch kiếp bất tư nghị, / Thị đa thiên ức Phật, / Phát đại thanh tịnh nguyện. /
Ngã vị nhữ lược thuyết, / Văn danh cập kiến thân, / Tâm niệm bất không quá, / Năng diệt chư hữu khổ. /
Giả sử hưng hại ý, / Thôi lạc đại hỏa khanh, / Niệm bỉ Quán Âm lực, / Hỏa khanh biến thành trì. /
Hoặc phiêu lưu cự hải, / Long ngư chư quỷ nạn, / Niệm bỉ Quán Âm lực, / Ba lãng bất năng một. /
Hoặc tại Tu Di phong, / Vị nhân sở thôi đọa, / Niệm bỉ Quán Âm lực, / Như nhật hư không trụ. /
Hoặc bị ác nhân trục, / Đọa lạc Kim Cang sơn, / Niệm bỉ Quán Âm lực, / Bất năng tổn nhất mao. /
Hoặc trị oán tặc nhiễu, / Các chấp đao gia hại, / Niệm bỉ Quán Âm lực, / Hàm tức khởi từ tâm. /
Hoặc tao vương nạn khổ, / Lâm hình dục thọ chung, / Niệm bỉ Quán Âm lực, / Đao tầm đoạn đoạn hoại. /
Hoặc tù cấm già tỏa, / Thủ túc bị nữu giới, / Niệm bỉ Quán Âm lực, / Thích nhiên đắc giải thoát. /
Chú thư chư độc dược, / Sở dục hại thân giả, / Niệm bỉ Quán Âm lực, / Hoàn trước ư bổn nhân. /
Hoặc ngộ ác La sát, / Độc long chư quỷ đẳng, / Niệm bỉ Quán Âm lực, / Thời tất bất cảm hại. /
Nhược ác thú vi nhiễu, / Lợi nha trảo khả bố, / Niệm bỉ Quán Âm lực, / Tật tẩu vô biên phương. /
Ngoan xà cập phúc yết, / Khí độc yên hỏa nhiên, / Niệm bỉ Quán Âm lực, / Tầm thanh tự hồi khứ. /
Vân lôi cổ xiết điện, / Giáng bạc chú đại vũ, / Niệm bỉ Quán Âm lực, / Ứng thời đắc tiêu tán. /
Chúng sanh bị khốn ách, / Vô lượng khổ bức thân, / Quán Âm diệu trí lực, / Năng cứu thế gian khổ. /
Cụ túc thần thông lực, / Quảng tu trí phương tiện, / Thập phương chư quốc độ, / Vô sát bất hiện thân. /
Chủng chủng chư ác thú, / Địa ngục quỷ súc sanh, / Sanh lão bệnh tử khổ, / Dĩ tiệm tất linh diệt. /
Chơn quán thanh tịnh quán, / Quảng đại trí huệ quán, / Bi quán cập từ quán, / Thường nguyện thường chiêm ngưỡng. /
Vô cấu thanh tịnh quang, / Huệ nhật phá chư ám, / Năng phục tai phong hỏa, / Phổ minh chiếu thế gian. /
Bi thể giới lôi chấn, / Từ ý diệu đại vân, / Chú cam lồ pháp vũ, / Diệt trừ phiền não diệm. /
Tranh tụng kinh quan xứ, / Bố úy quân trận trung, / Niệm bỉ Quán Âm lực, / Chúng oán tất thoái tán. /
Diệu âm Quán Thế Âm, / Phạm âm hải triều âm, / Thắng bỉ thế gian âm, / Thị cố tu thường niệm. /
Niệm niệm vật sanh nghi, / Quán Thế Âm tịnh thánh, / Ư khổ não tử ách, / Năng vị tác y hộ. /
Cụ nhất thiết công đức, / Từ nhãn thị chúng sanh, / Phước tụ hải vô lượng, / Thị cố ưng đảnh lễ.`);

const PHO_MON_P2 = `Nhĩ thời Trì Địa Bồ Tát, tức tùng tòa khởi, tiền bạch Phật ngôn: Thế Tôn! Nhược hữu chúng sanh, văn thị Quán Thế Âm Bồ Tát phẩm, tự tại chi nghiệp, Phổ Môn thị hiện, thần thông lực giả, đương tri thị nhân công đức bất thiểu.
Phật thuyết thị Phổ Môn phẩm thời, chúng trung bát vạn tứ thiên chúng sanh, giai phát vô đẳng đẳng, A nậu đa la tam miệu tam bồ đề tâm.`;

const PHO_MON = mk({
  id: 'pham-pho-mon', group: 'Thời khóa', title: 'Phẩm Phổ Môn', subtitle: 'Quán Thế Âm Bồ Tát Phổ Môn · kinh Diệu Pháp Liên Hoa',
  blurb: 'Phẩm kinh ca ngợi hạnh nguyện lắng nghe và cứu khổ của Bồ Tát Quán Thế Âm, gồm văn xuôi và kệ.',
  lines: [...chia(PHO_MON_P1), ...PHO_MON_KE, ...chia(PHO_MON_P2)],
  source: 'Bản Hán-Việt phổ biến (Cưu Ma La Thập dịch), đối chiếu từ bản tụng thông dụng; đoạn Quán Âm ứng hiện các thân được viết theo mẫu câu lặp của kinh. Chưa qua chư tăng duyệt, có thể có dị bản đôi chữ.',
});

const BAT_DAI_NHAN_GIAC = mk({
  id: 'kinh-bat-dai-nhan-giac', group: 'Thời khóa', title: 'Kinh Bát Đại Nhân Giác', subtitle: 'Tám điều giác ngộ của bậc đại nhân',
  blurb: 'Bản kinh ngắn nêu tám điều giác ngộ: vô thường, thiểu dục, tri túc, tinh tấn, trí tuệ, bố thí, giữ hạnh thanh bạch và đại nguyện từ bi.',
  lines: chia(`Phật thuyết Bát Đại Nhân Giác Kinh.
Vi Phật đệ tử, trú dạ chí tâm, tụng niệm bát đại nhân giác.
Đệ nhất giác ngộ: Thế gian vô thường, quốc độ nguy thúy, tứ đại khổ không, ngũ ấm vô ngã, sanh diệt biến dị, hư ngụy vô chủ. Tâm thị ác nguyên, hình vi tội tẩu. Như thị quán sát, tiệm ly sanh tử.
Đệ nhị giác tri: Đa dục vi khổ, sanh tử bì lao, tùng tham dục khởi. Thiểu dục vô vi, thân tâm tự tại.
Đệ tam giác ngộ: Tâm vô yếm túc, duy đắc đa cầu, tăng trưởng tội ác. Bồ Tát bất nhĩ, thường niệm tri túc, an bần thủ đạo, duy huệ thị nghiệp.
Đệ tứ giác tri: Giải đãi trụy lạc, thường hành tinh tấn, phá phiền não ác, tồi phục tứ ma, xuất ấm giới ngục.
Đệ ngũ giác ngộ: Ngu si sanh tử, Bồ Tát thường niệm, quảng học đa văn, tăng trưởng trí huệ, thành tựu biện tài, giáo hóa nhất thiết, tất dĩ đại lạc.
Đệ lục giác tri: Bần khổ đa oán, hoành kết ác duyên. Bồ Tát bố thí, đẳng chư oán thân, bất niệm cựu ác, bất tắng ác nhân.
Đệ thất giác ngộ: Ngũ dục quá hoạn, tuy vi thế tục, bất nhiễm thế lạc, thường niệm tam y, ngõa bát pháp khí, chí nguyện xuất gia, thủ đạo thanh bạch, phạm hạnh cao viễn, từ bi nhất thiết.
Đệ bát giác tri: Sanh tử xí nhiên, khổ não vô lượng, phát đại thừa tâm, phổ tế nhất thiết, nguyện đại chúng sanh thọ vô lượng khổ, linh chư chúng sanh, tất cứu cánh lạc.
Như thử bát sự, thị chư Phật, Bồ Tát, đại nhân chi sở giác ngộ. Tinh tấn hành đạo, từ bi tu huệ, thừa pháp thân thuyền, chí Niết Bàn ngạn; phục hoàn sanh tử, độ thoát chúng sanh. Dĩ tiền bát sự, khai đạo nhất thiết, linh chư chúng sanh, giác sanh tử khổ, xả ly ngũ dục, tu tâm Thánh đạo.
Nhược Phật đệ tử, tụng thử bát sự, ư niệm niệm trung, diệt vô lượng tội, tiến thú Bồ Đề, tốc chứng Chánh giác, vĩnh đoạn sanh tử, thường trú khoái lạc.`),
  source: SRC_COMMON + ' Bản dịch truyền là của An Thế Cao.',
});

const VU_LAN = mk({
  id: 'kinh-vu-lan', group: 'Thời khóa', title: 'Kinh Vu Lan Báo Hiếu', subtitle: 'Bản tóm lược tiếng Việt để đọc và suy ngẫm',
  blurb: 'Câu chuyện Tôn giả Mục Kiền Liên tìm cách cứu mẹ và ý nghĩa mùa báo hiếu Vu Lan.',
  lines: chia(`Tôi nghe như vầy.
Một thuở nọ, Đức Phật ở tại vườn Kỳ Thọ Cấp Cô Độc, nước Xá Vệ.
Tôn giả Mục Kiền Liên đã chứng sáu phép thần thông, nghĩ đến việc báo đáp ơn sinh thành của cha mẹ.
Ngài dùng đạo nhãn quan sát thế gian và thấy mẹ mình đang chịu cảnh đói khát khổ sở.
Ngài thương xót, đem bát cơm dâng mẹ.
Nhưng cơm vừa đến miệng đã hóa thành lửa than, bà không thể ăn được.
Ngài khóc than đau xót, quay về bạch với Đức Phật.
Đức Phật dạy rằng nghiệp của mẹ ngài sâu nặng, sức một người không thể cứu được.
Cần nhờ oai đức của chư Tăng mười phương.
Vào ngày rằm tháng bảy, ngày chư Tăng kết thúc ba tháng an cư, hãy sắm sửa lễ cúng dường thanh tịnh.
Hãy thành tâm cúng dường chư Tăng và hồi hướng công đức cho cha mẹ nhiều đời.
Mục Kiền Liên làm theo lời Phật dạy, và mẹ ngài được thoát khỏi khổ cảnh.
Từ đó, rằm tháng bảy trở thành mùa Vu Lan báo hiếu.
Con cái nhớ ơn cha mẹ, thầy bạn, tổ tiên và mọi người đã nâng đỡ mình.
Cha mẹ còn đây, hãy dành thời gian chăm sóc, hỏi han và nói lời yêu thương.
Cha mẹ đã khuất, hãy làm việc lành và hồi hướng công đức cho cha mẹ.
Nguyện cho cha mẹ nhiều đời được an lạc.
Nguyện cho mọi chúng sanh được thoát khổ.`),
  source: 'Không phải toàn văn kinh: đây là bản tóm lược tự soạn bằng tiếng Việt theo nội dung Kinh Vu Lan Bồn để đọc và suy ngẫm. Muốn tụng toàn văn, xin theo bản kinh của chùa hoặc bản in có chư tăng hiệu đính.',
});

const CHU_DAI_BI = mk({
  id: 'chu-dai-bi',
  group: 'Chú',
  title: 'Chú Đại Bi',
  subtitle: 'Thiên Thủ Thiên Nhãn Vô Ngại Đại Bi Tâm Đà La Ni · 84 câu',
  blurb: 'Bài thần chú nuôi dưỡng tâm đại bi rộng lớn của Bồ Tát Quán Thế Âm, gồm tám mươi tư câu phiên âm Hán-Việt.',
  lines: [
    'Nam mô hắc ra đát na đa ra dạ da.',
    'Nam mô a rị da,',
    'Bà lô yết đế thước bát ra da,',
    'Bồ đề tát đỏa bà da,',
    'Ma ha tát đỏa bà da,',
    'Ma ha ca lô ni ca da.',
    'Án,',
    'Tát bàn ra phạt duệ,',
    'Số đát na đát tỏa.',
    'Nam mô tất kiết lật đỏa y mông a rị da,',
    'Bà lô kiết đế thất Phật ra lăng đà bà.',
    'Nam mô na ra cẩn trì,',
    'Hê rị ma ha bàn đa sa mế,',
    'Tát bà a tha đậu du bằng,',
    'A thệ dựng,',
    'Tát bà tát đa na ma bà tát đa, na ma bà già,',
    'Ma phạt đặc đậu.',
    'Đát điệt tha.',
    'Án, a bà lô hê,',
    'Lô ca đế,',
    'Ca ra đế,',
    'Di hê rị,',
    'Ma ha bồ đề tát đỏa,',
    'Tát bà tát bà,',
    'Ma ra ma ra,',
    'Ma hê ma hê rị đà dựng,',
    'Câu lô câu lô kiết mông,',
    'Độ lô độ lô phạt xà da đế,',
    'Ma ha phạt xà da đế,',
    'Đà ra đà ra,',
    'Địa rị ni,',
    'Thất Phật ra da,',
    'Giá ra giá ra.',
    'Mạ mạ phạt ma ra,',
    'Mục đế lệ,',
    'Y hê y hê,',
    'Thất na thất na,',
    'A ra sâm Phật ra xá lợi,',
    'Phạt sa phạt sâm,',
    'Phật ra xá da,',
    'Hô lô hô lô ma ra,',
    'Hô lô hô lô hê rị,',
    'Ta ra ta ra,',
    'Tất rị tất rị,',
    'Tô rô tô rô,',
    'Bồ đề dạ bồ đề dạ,',
    'Bồ đà dạ bồ đà dạ,',
    'Di đế rị dạ,',
    'Na ra cẩn trì,',
    'Địa rị sắc ni na,',
    'Ba dạ ma na,',
    'Ta bà ha.',
    'Tất đà dạ,',
    'Ta bà ha.',
    'Ma ha tất đà dạ,',
    'Ta bà ha.',
    'Tất đà du nghệ,',
    'Thất bàn ra dạ,',
    'Ta bà ha.',
    'Na ra cẩn trì,',
    'Ta bà ha.',
    'Ma ra na ra,',
    'Ta bà ha.',
    'Tất ra tăng a mục khê da,',
    'Ta bà ha.',
    'Ta bà ma ha a tất đà dạ,',
    'Ta bà ha.',
    'Giả kiết ra a tất đà dạ,',
    'Ta bà ha.',
    'Ba đà ma yết tất đà dạ,',
    'Ta bà ha.',
    'Na ra cẩn trì bàn đà ra dạ,',
    'Ta bà ha.',
    'Ma bà lợi thắng yết ra dạ,',
    'Ta bà ha.',
    'Nam mô hắc ra đát na đa ra dạ da,',
    'Nam mô a rị da,',
    'Bà lô yết đế,',
    'Thước bàn ra dạ,',
    'Ta bà ha.',
    'Án, tất điện đô,',
    'Mạn đa ra,',
    'Bạt đà dạ,',
    'Ta bà ha.',
  ],
  source: 'Bản phiên âm Hán-Việt phổ biến 84 câu (Thiên Thủ Thiên Nhãn Vô Ngại Đại Bi Tâm Đà La Ni, Già Phạm Đạt Ma dịch), đối chiếu từ nghi thức tụng niệm thông dụng; chưa qua chư tăng duyệt.',
});

const VANG_SANH = mk({
  id: 'vang-sanh-than-chu',
  group: 'Chú',
  title: 'Vãng Sanh Thần Chú',
  subtitle: 'Bạt nhất thiết nghiệp chướng căn bản đắc sanh Tịnh độ đà-la-ni',
  blurb: 'Bài chú ngắn trong thập chú, thường trì tụng để tiêu trừ chướng ngại và phát nguyện sanh về cõi Tịnh độ.',
  lines: [
    'Nam mô a di đa bà dạ,',
    'Đa tha già đa dạ,',
    'Đa địa dạ tha.',
    'A di rị đô bà tỳ,',
    'A di rị đa tất đam bà tỳ,',
    'A di rị đa tỳ ca lan đế,',
    'A di rị đa tỳ ca lan đa,',
    'Già di nị, già già na,',
    'Chỉ đa ca lệ, ta bà ha.',
  ],
  source: 'Bản phiên âm Hán-Việt 59 chữ phổ biến trong nghi thức Tịnh độ (Cầu Na Bạt Đà La dịch); trong thời khóa thường trì tụng ba biến liên tiếp. Chưa qua chư tăng duyệt.',
});

const repeat = (line: string, count: number): string[] => Array.from({ length: count }, () => line);

const NIEM_PHAT = mk({
  id: 'niem-phat',
  group: 'Kệ & sám nguyện',
  title: 'Niệm Phật',
  subtitle: 'Tán Phật và xưng niệm hồng danh Tây Phương Thánh Chúng',
  blurb: 'Bài kệ tán thán Đức Phật A Di Đà cùng chuỗi câu niệm hồng danh chư Phật, Bồ Tát để nhiếp tâm thanh tịnh.',
  lines: [
    'A Di Đà Phật thân kim sắc,',
    'Tướng hảo quang minh vô đẳng luân,',
    'Bạch hào uyển chuyển ngũ Tu Di,',
    'Hám mục trừng thanh tứ đại hải.',
    'Quang trung hóa Phật vô số ức,',
    'Hóa Bồ Tát chúng diệc vô biên,',
    'Tứ thập bát nguyện độ chúng sanh,',
    'Cửu phẩm hàm linh đăng bỉ ngạn.',
    'Nam mô Tây Phương Cực Lạc Thế Giới,',
    'Đại Từ Đại Bi A Di Đà Phật.',
    ...repeat('Nam mô A Di Đà Phật.', 10),
    ...repeat('Nam mô Quán Thế Âm Bồ Tát.', 3),
    ...repeat('Nam mô Đại Thế Chí Bồ Tát.', 3),
    ...repeat('Nam mô Địa Tạng Vương Bồ Tát.', 3),
    ...repeat('Nam mô Thanh Tịnh Đại Hải Chúng Bồ Tát.', 3),
  ],
  source: SRC_COMMON + ' Kệ Tán Phật A Di Đà kèm thập niệm và tam xưng hồng danh chư vị Bồ Tát.',
});

const NIEM_DIA_TANG = mk({
  id: 'niem-dia-tang-vuong-bo-tat',
  group: 'Kệ & sám nguyện',
  title: 'Niệm Địa Tạng Vương Bồ Tát',
  subtitle: 'Tán lễ đại nguyện và xưng niệm hồng danh Bồ Tát Địa Tạng',
  blurb: 'Tưởng nhớ hạnh hiếu và đại nguyện cứu khổ của Đức Địa Tạng Vương Bồ Tát qua lời kệ nguyện và hồng danh.',
  lines: [
    'Chí tâm đảnh lễ:',
    'U Minh Giáo Chủ Bổn Tôn Địa Tạng Bồ Tát Ma Ha Tát.',
    'Đại bi, đại nguyện, đại thánh, đại từ,',
    'Bổn Tôn Địa Tạng Vương Bồ Tát.',
    'Địa ngục vị không, thệ bất thành Phật,',
    'Chúng sanh độ tận, phương chứng Bồ Đề.',
    ...repeat('Nam mô Đại Nguyện Địa Tạng Vương Bồ Tát.', 3),
    ...repeat('Nam mô Địa Tạng Vương Bồ Tát.', 10),
    ...repeat('Nam mô Thanh Tịnh Đại Hải Chúng Bồ Tát.', 3),
  ],
  source: SRC_COMMON + ' Tổng hợp từ câu nguyện truyền thống và nghi thức xưng niệm hồng danh Địa Tạng Vương Bồ Tát.',
});

const TU_HOANG_THE_NGUYEN = mk({
  id: 'tu-hoang-the-nguyen',
  group: 'Kệ & sám nguyện',
  title: 'Tứ Hoằng Thệ Nguyện',
  subtitle: 'Bốn lời thệ nguyện rộng lớn của người con Phật',
  blurb: 'Bốn lời phát nguyện nền tảng của hạnh Bồ Tát: độ chúng sanh, đoạn phiền não, học pháp môn và thành Phật đạo.',
  lines: [
    'Chúng sanh vô biên thệ nguyện độ,',
    'Phiền não vô tận thệ nguyện đoạn,',
    'Pháp môn vô lượng thệ nguyện học,',
    'Phật đạo vô thượng thệ nguyện thành.',
  ],
  source: SRC_COMMON,
});

export const DEDICATION: string[] = [
  'Nguyện đem công đức này,',
  'Hướng về khắp tất cả,',
  'Đệ tử và chúng sanh,',
  'Đều trọn thành Phật đạo.',
];

const KE_HOI_HUONG = mk({
  id: 'ke-hoi-huong',
  group: 'Kệ & sám nguyện',
  title: 'Kệ Hồi Hướng',
  subtitle: 'Chia sẻ công đức đến khắp pháp giới chúng sanh',
  blurb: 'Bốn câu kệ khép lại thời công phu, nguyện đem phước lành vừa tu tập hướng về tất cả muôn loài.',
  lines: [...DEDICATION],
  source: 'Bản Việt dịch phổ thông của bài Kệ Hồi Hướng ("Nguyện dĩ thử công đức…"), thường đọc cuối mỗi thời kinh; chưa qua chư tăng duyệt.',
});

export const SUTRAS: Sutra[] = [
  KHAI_KINH,
  TAM_TU_QUY,
  KE_SAM_HOI,
  TAM_KINH,
  A_DI_DA,
  PHO_MON,
  BAT_DAI_NHAN_GIAC,
  VU_LAN,
  CHU_DAI_BI,
  VANG_SANH,
  NIEM_PHAT,
  NIEM_DIA_TANG,
  TU_HOANG_THE_NGUYEN,
  KE_HOI_HUONG,
];

const BY_ID = new Map<string, Sutra>(SUTRAS.map((s) => [s.id, s]));

export function getSutra(id: string): Sutra | undefined {
  return BY_ID.get(id);
}

/** Thứ tự gợi ý cho một thời khóa công phu ngắn gọn (~12–15 phút). */
export const SESSION_PLAN: string[] = [
  'ke-khai-kinh',
  'chu-dai-bi',
  'bat-nha-tam-kinh',
  'vang-sanh-than-chu',
  'ke-sam-hoi',
  'tam-tu-quy',
  'ke-hoi-huong',
];

