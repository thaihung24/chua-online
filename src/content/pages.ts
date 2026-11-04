/**
 * Nội dung các trang tĩnh SEO của "Chùa Liên Hoa".
 * Cú pháp liên kết trong đoạn văn / mục danh sách: [chữ hiển thị](slug)
 *  - slug là một slug trong PAGES, hoặc `kinh`, hoặc `kinh/<sutra-id>`, hoặc `/` (trang chủ ứng dụng).
 * File này không import gì để có thể chạy độc lập bằng tsx.
 */
export interface PageSection {
  h2?: string;
  p: string[];
  list?: string[];
}
export interface PageFaq {
  q: string;
  a: string;
}
export interface Page {
  slug: string;
  title: string;
  description: string;
  h1: string;
  sections: PageSection[];
  faq?: PageFaq[];
  related: string[];
  updated?: string;
}

const UPDATED = '2026-11-01';

const RAW_PAGES: Page[] = [
  // ───────────────────────────── gioi-thieu
  {
    slug: 'gioi-thieu',
    title: 'Giới thiệu Chùa Liên Hoa – ngôi chùa online để tịnh tâm',
    description:
      'Chùa Liên Hoa là phần mềm độc lập, mô phỏng khuôn viên chùa 3D để niệm Phật, tụng kinh, thiền định và giữ nếp tu tập mỗi ngày. Không phải chùa thật.',
    h1: 'Chùa Liên Hoa: một góc nhỏ để lắng lòng giữa ngày bận rộn',
    sections: [
      {
        h2: 'Chùa Liên Hoa là gì?',
        p: [
          'Chùa Liên Hoa là một ứng dụng web mô phỏng khuôn viên chùa bằng đồ họa ba chiều. Bạn có thể mở trình duyệt trên điện thoại hay máy tính, bước đi trong sân chùa, thắp một nén hương, dâng hoa, rung chuông, rồi ngồi xuống niệm Phật hoặc tụng một thời kinh ngắn. Mục đích duy nhất của ứng dụng là tạo ra một không gian yên tĩnh, đẹp mắt và dễ tiếp cận, để những ai bận rộn vẫn có vài phút trở về với hơi thở của chính mình.',
          'Tên “Liên Hoa” có nghĩa là hoa sen, loài hoa mọc lên từ bùn mà vẫn thanh sạch. Hình ảnh ấy gợi nhắc rằng giữa đời sống nhiều áp lực, chúng ta vẫn có thể giữ được một tâm hồn nhẹ nhàng nếu biết nuôi dưỡng nó mỗi ngày.',
        ],
      },
      {
        h2: 'Điều cần nói rõ: đây không phải chùa thật',
        p: [
          'Chùa Liên Hoa là phần mềm độc lập, do một nhóm người làm phần mềm xây dựng với lòng thành kính. Đây không phải là một ngôi chùa thật, không có sư thầy hay ban trị sự nào đứng sau, và ứng dụng không thuộc về bất kỳ tổ chức tôn giáo nào. Mọi hoạt động trong ứng dụng, từ thắp hương đến thả đèn, đều là mô phỏng và không thay thế cho việc đến chùa, nghe pháp, thọ giới hay học hỏi với một vị thầy có đạo hạnh.',
          'Phần kinh văn trong ứng dụng được tổng hợp từ các bản tụng phổ biến để bạn tiện đọc theo. Nếu cần bản chuẩn xác cho việc hành trì lâu dài, bạn nên đối chiếu với kinh sách do các chùa và nhà xuất bản Phật giáo ấn hành, hoặc hỏi quý thầy cô tại ngôi chùa gần nhà.',
        ],
      },
      {
        h2: 'Bạn có thể làm gì trong ứng dụng?',
        p: ['Các tính năng được thiết kế để nhẹ nhàng, không gây áp lực thi đua:'],
        list: [
          'Đi dạo trong sân chùa ba chiều, thắp [hương, hoa và nến](thap-huong-online), rung chuông.',
          '[Niệm Phật](niem-phat-online) với tràng hạt, [tụng kinh](kinh) theo nhịp mõ.',
          'Ngồi [thiền online](thien-online) với đồng hồ hẹn giờ yên tĩnh.',
          '[Thả đèn hoa đăng](tha-den-hoa-dang) gửi một lời nguyện lành.',
          '[Xin quẻ cho vui](xin-que-online): nhận một lời nhắc tích cực để suy ngẫm.',
          'Giữ nhịp tu tập bằng cấp độ, chuỗi ngày “giữ lửa” và lời nhắc hằng ngày.',
          'Gặp gỡ trong phòng chung (tối đa 100 người) hoặc phòng riêng với bạn đạo, chỉ dùng các câu chào soạn sẵn, không có khung chat tự do.',
        ],
      },
      {
        h2: 'Tinh thần của cộng đồng',
        p: [
          'Chúng tôi mong không gian này giữ được sự trong lành: không quảng cáo ồn ào, không xếp hạng gây ganh đua, không tranh luận. Trước khi bắt đầu, mời bạn đọc [nội quy](noi-quy) và [hướng dẫn đi chùa online](huong-dan-di-chua-online). Nếu còn thắc mắc, phần [hỏi đáp](hoi-dap) có thể giúp bạn. Nguyện cho mỗi phút bạn ghé qua đều mang lại một chút bình an.',
        ],
      },
    ],
    faq: [
      {
        q: 'Chùa Liên Hoa có phải là một ngôi chùa thật không?',
        a: 'Không. Đây là phần mềm độc lập, không phải chùa thật và không thuộc tổ chức tôn giáo nào. Ứng dụng chỉ mô phỏng để hỗ trợ bạn tịnh tâm.',
      },
      {
        q: 'Sử dụng Chùa Liên Hoa có mất phí không?',
        a: 'Các tính năng chính để niệm Phật, tụng kinh và thiền đều có thể dùng miễn phí, không cần cúng dường tiền bạc trong ứng dụng.',
      },
      {
        q: 'Tôi có cần là Phật tử mới dùng được không?',
        a: 'Không cần. Bất cứ ai muốn có vài phút yên tĩnh đều có thể ghé thăm, miễn là giữ thái độ tôn trọng.',
      },
    ],
    related: ['huong-dan-di-chua-online', 'hoi-dap', 'noi-quy', 'chinh-sach-quyen-rieng-tu', 'dieu-khoan-su-dung'],
  },
  // ───────────────────────────── huong-dan-di-chua-online
  {
    slug: 'huong-dan-di-chua-online',
    title: 'Hướng dẫn đi chùa online: từ bước vào cổng đến công phu',
    description:
      'Hướng dẫn từng bước đi chùa online trên Chùa Liên Hoa: di chuyển trong sân chùa 3D, thắp hương, rung chuông, niệm Phật, tụng kinh, thiền và thả đèn hoa đăng.',
    h1: 'Cách đi chùa online nhẹ nhàng, từng bước một',
    sections: [
      {
        h2: 'Chuẩn bị trước khi vào chùa',
        p: [
          'Đi chùa online cũng như đi chùa thật: điều quan trọng nhất là tâm thế. Hãy chọn một lúc tương đối yên tĩnh, tắt bớt thông báo điện thoại, ngồi thẳng lưng và hít vài hơi thở sâu. Nếu có thể, hãy đeo tai nghe để nghe rõ tiếng chuông, tiếng mõ và âm thanh khuôn viên. Ứng dụng chạy trực tiếp trên trình duyệt, không cần cài thêm gì; bạn chỉ cần bấm nút “Vào chùa” ở [trang chủ](/).',
          'Lần đầu vào, bạn sẽ tạo một hồ sơ nhỏ gồm tên gọi và dáng vẻ nhân vật. Hồ sơ được lưu ngay trên thiết bị của bạn. Bạn có thể dùng pháp danh, biệt danh hoặc tên thật tùy ý, nhưng nên chọn tên lịch sự, không gây hiểu nhầm.',
        ],
      },
      {
        h2: 'Đi dạo và lễ Phật trong sân chùa',
        p: [
          'Trong sân chùa, bạn di chuyển bằng phím mũi tên hoặc WASD trên máy tính, hoặc bằng cần điều khiển ảo trên điện thoại. Hãy bước chậm, ngắm cảnh, rồi đến gần chính điện, lư hương, bàn hoa và chuông. Khi đến gần một vật có thể tương tác, ứng dụng sẽ hiện gợi ý để bạn chọn hành động.',
        ],
        list: [
          '[Thắp hương, dâng hoa, thắp nến](thap-huong-online): nghĩ đến một điều lành rồi mới thực hiện.',
          'Rung chuông: một tiếng chuông ngân giúp tâm lắng lại trước khi công phu.',
          '[Niệm Phật](niem-phat-online) với tràng hạt: mỗi hạt một câu danh hiệu.',
          '[Tụng kinh](kinh) theo nhịp [gõ mõ](go-mo-online): chọn một bài ngắn nếu bạn mới bắt đầu.',
          '[Ngồi thiền](thien-online) với đồng hồ hẹn giờ từ vài phút.',
        ],
      },
      {
        h2: 'Gặp bạn đạo trong phòng chung hoặc phòng riêng',
        p: [
          'Bạn có thể vào phòng chung, nơi có tối đa 100 người cùng ghé thăm, hoặc tạo phòng riêng để rủ người thân cùng công phu. Giao tiếp chỉ qua các câu chào soạn sẵn như “A Di Đà Phật”, “Chúc bình an”, “Tùy hỷ” hay “Mình cùng niệm Phật nhé”. Thiết kế này giúp không gian luôn hòa nhã và tránh những cuộc trò chuyện làm xao lãng người khác. Xin đọc thêm [nội quy](noi-quy) để cùng gìn giữ bầu không khí chung.',
        ],
      },
      {
        h2: 'Giữ nếp tu tập mỗi ngày',
        p: [
          'Ứng dụng có cấp độ, chuỗi ngày “giữ lửa” và lời nhắc hằng ngày để giúp bạn đều đặn. Đừng xem đó là thành tích để so đo; hãy xem như một cách tự nhắc mình. Nếu lỡ ngắt chuỗi một hôm, cứ nhẹ nhàng bắt đầu lại. Vào những ngày đặc biệt như [mùng một và rằm](ngay-ram-mung-mot), bạn có thể tra [lịch âm](lich-am) để biết ngày và dành thêm thời gian cho công phu.',
          'Cuối mỗi thời tu, đừng quên hồi hướng: nguyện đem công đức này chia sẻ đến tất cả chúng sinh. Nếu có thắc mắc về cách dùng, hãy xem phần [hỏi đáp](hoi-dap).',
        ],
      },
    ],
    faq: [
      {
        q: 'Tôi cần cài ứng dụng để đi chùa online không?',
        a: 'Không. Chùa Liên Hoa chạy trên trình duyệt hiện đại; bạn có thể thêm vào màn hình chính điện thoại để mở nhanh như một ứng dụng.',
      },
      {
        q: 'Tôi nên làm gì đầu tiên khi mới vào?',
        a: 'Hãy rung chuông, thắp một nén hương rồi ngồi niệm Phật hoặc thiền vài phút. Không cần làm tất cả mọi việc trong một lần.',
      },
      {
        q: 'Điện thoại cũ có chơi được không?',
        a: 'Thông thường được. Nếu máy chậm, bạn có thể giảm chất lượng đồ họa trong phần cài đặt để mượt hơn.',
      },
    ],
    related: ['gioi-thieu', 'niem-phat-online', 'thien-online', 'thap-huong-online', 'noi-quy', 'hoi-dap'],
  },
  // ───────────────────────────── hoi-dap
  {
    slug: 'hoi-dap',
    title: 'Hỏi đáp về Chùa Liên Hoa – chùa online và niệm Phật',
    description:
      'Giải đáp câu hỏi thường gặp về Chùa Liên Hoa: có phải chùa thật không, miễn phí không, cách niệm Phật, tụng kinh, thiền, xin quẻ, phòng chung, quyền riêng tư.',
    h1: 'Những câu hỏi thường gặp khi đi chùa online',
    sections: [
      {
        h2: 'Về ứng dụng',
        p: [
          'Trang này tổng hợp những câu hỏi mà người mới thường gửi đến. Trước hết, xin nhắc lại một điều quan trọng: Chùa Liên Hoa là phần mềm độc lập, không phải chùa thật và không thuộc bất kỳ tổ chức tôn giáo nào. Bạn có thể đọc thêm tại trang [giới thiệu](gioi-thieu). Các câu hỏi bên dưới được chia theo chủ đề để bạn dễ tìm. Chúng tôi viết phần trả lời bằng ngôn ngữ giản dị, tránh dùng thuật ngữ khó, để cả người chưa từng đến chùa cũng có thể hiểu và thấy yên tâm khi bắt đầu.',
          'Chùa Liên Hoa được làm ra với mong muốn rất nhỏ: giúp bạn có vài phút lắng lòng giữa ngày bận rộn. Bạn có thể đi dạo trong sân chùa ba chiều, thắp hương, rung chuông, niệm Phật, tụng kinh theo nhịp mõ, ngồi thiền, thả đèn hoa đăng hoặc xin một quẻ cho vui. Mỗi hoạt động đều được thiết kế nhẹ nhàng, không thúc ép và không so đo thành tích.',
        ],
      },
      {
        h2: 'Về việc tu tập trong ứng dụng',
        p: [
          'Tu tập không phải là cuộc chạy đua. Ứng dụng có cấp độ và chuỗi ngày “giữ lửa” chỉ để nhắc bạn đều đặn, còn việc bạn tu học sâu đến đâu là chuyện của riêng bạn và của vị thầy mà bạn nương học. Nếu bạn là người mới, hãy bắt đầu từ những việc rất nhỏ: một tiếng chuông, một nén hương, năm phút [niệm Phật](niem-phat-online) hoặc [thiền](thien-online). Sự đều đặn quan trọng hơn thời lượng. Với kinh văn, bạn có thể xem [mục lục kinh](kinh) và đọc phần [ý nghĩa từng kinh](y-nghia-tung-kinh) để hiểu trước khi tụng.',
        ],
      },
      {
        h2: 'Về cộng đồng và dữ liệu',
        p: [
          'Phòng chung và phòng riêng chỉ cho phép dùng các câu chào soạn sẵn. Về dữ liệu cá nhân, mời bạn xem [chính sách quyền riêng tư](chinh-sach-quyen-rieng-tu) và [điều khoản sử dụng](dieu-khoan-su-dung). Chúng tôi giữ mọi quy định ngắn gọn và dễ hiểu, vì mong không gian này luôn an toàn, hòa nhã cho cả người lớn tuổi lẫn người trẻ. Nếu câu hỏi của bạn chưa có ở đây, hãy gửi góp ý trong ứng dụng; chúng tôi sẽ bổ sung dần.',
        ],
      },
    ],
    faq: [
      {
        q: 'Chùa Liên Hoa có phải là chùa thật không?',
        a: 'Không. Đây là phần mềm độc lập mô phỏng không gian chùa, không phải chùa thật và không thuộc tổ chức tôn giáo nào. Việc thắp hương, thả đèn trong ứng dụng chỉ mang tính mô phỏng và không thay thế việc đến chùa thật hay học hỏi với bậc thầy.',
      },
      {
        q: 'Dùng Chùa Liên Hoa có mất tiền không?',
        a: 'Các tính năng chính như niệm Phật, tụng kinh, thiền, thắp hương và xin quẻ đều dùng miễn phí. Ứng dụng không yêu cầu bạn cúng dường hay thanh toán để được “phước”.',
      },
      {
        q: 'Làm sao để bắt đầu niệm Phật hoặc tụng kinh?',
        a: 'Vào sân chùa, đến gần tràng hạt hoặc bàn kinh, chọn một bài ngắn như Tam Tự Quy hoặc Niệm Phật. Chữ chạy theo nhịp mõ giúp bạn tụng đúng nhịp. Xem thêm bài [cách niệm Phật](cach-niem-phat).',
      },
      {
        q: 'Xin quẻ trong ứng dụng có bói được vận mệnh không?',
        a: 'Không. “Xin quẻ” chỉ là trò vui nhẹ nhàng, mỗi quẻ là một lời nhắc tích cực để suy ngẫm. Quẻ không dự đoán tương lai, tiền bạc hay sức khỏe và không nên dùng để quyết định việc quan trọng.',
      },
      {
        q: 'Chuỗi ngày “giữ lửa” và cấp độ để làm gì?',
        a: 'Đó là cách giúp bạn nhớ tu tập đều đặn. Mỗi ngày bạn có hoạt động như niệm Phật, tụng kinh hay thiền thì chuỗi tăng thêm. Nếu lỡ ngắt chuỗi, bạn chỉ cần bắt đầu lại, không có hình phạt nào.',
      },
      {
        q: 'Phòng chung và phòng riêng khác nhau thế nào?',
        a: 'Phòng chung công khai, tối đa 100 người cùng lúc. Phòng riêng do bạn tạo, chỉ những người có mã mới vào được, phù hợp để cùng gia đình, bạn bè công phu. Cả hai đều chỉ dùng câu chào soạn sẵn, không có chat tự do.',
      },
      {
        q: 'Dữ liệu của tôi được lưu ở đâu?',
        a: 'Hồ sơ và tiến trình được lưu ngay trên thiết bị của bạn. Nếu bạn tự tạo tài khoản bằng email, tiến trình có thể được đồng bộ để dùng trên nhiều máy. Chúng tôi không bán dữ liệu cá nhân. Chi tiết xem ở [chính sách quyền riêng tư](chinh-sach-quyen-rieng-tu).',
      },
      {
        q: 'Tôi muốn được nhắc tu tập mỗi ngày thì làm thế nào?',
        a: 'Bạn có thể bật lời nhắc hằng ngày trong phần cài đặt, nếu trình duyệt cho phép thông báo. Bạn cũng có thể tắt bất cứ lúc nào.',
      },
      {
        q: 'Kinh văn trong ứng dụng có chuẩn không?',
        a: 'Kinh văn được tổng hợp từ các bản tụng phổ biến và chưa qua quý thầy duyệt chính thức. Nếu cần bản chuẩn cho việc hành trì lâu dài, hãy đối chiếu với kinh sách do các chùa ấn hành hoặc hỏi quý thầy cô.',
      },
      {
        q: 'Tôi phát hiện người dùng cư xử không phù hợp, phải làm sao?',
        a: 'Bạn có thể rời phòng, tạo phòng riêng hoặc báo cho chúng tôi qua phần góp ý. Xin xem [nội quy](noi-quy) để biết những điều cộng đồng cùng gìn giữ.',
      },
    ],
    related: ['gioi-thieu', 'huong-dan-di-chua-online', 'noi-quy', 'chinh-sach-quyen-rieng-tu', 'xin-que-online'],
  },
  // ───────────────────────────── niem-phat-online
  {
    slug: 'niem-phat-online',
    title: 'Niệm Phật online với tràng hạt – Chùa Liên Hoa',
    description:
      'Niệm Phật online cùng tràng hạt và nhịp mõ dịu nhẹ: cách bắt đầu, đếm hạt, giữ tâm chuyên nhất và duy trì thói quen niệm Phật mỗi ngày ngay trên Chùa Liên Hoa.',
    h1: 'Niệm Phật online: mỗi hạt một câu danh hiệu',
    sections: [
      {
        h2: 'Niệm Phật là gì?',
        p: [
          'Niệm Phật là nhớ nghĩ và xưng danh hiệu Phật, phổ biến nhất ở Việt Nam là câu “Nam mô A Di Đà Phật”. “Nam mô” có nghĩa là quy y, kính lễ; “A Di Đà” là danh hiệu của vị Phật được nhắc đến trong [Kinh A Di Đà](kinh/kinh-a-di-da). Người niệm Phật dùng câu danh hiệu như một điểm tựa để tâm bớt tản mạn, bớt lo nghĩ, dần trở nên an định. Bạn không cần phải có điều kiện đặc biệt nào, chỉ cần một chút thời gian và lòng chân thành.',
          'Nhiều người còn niệm danh hiệu Quán Thế Âm hay Địa Tạng Vương Bồ Tát. Bạn có thể tìm hiểu thêm ở bài [Quan Thế Âm Bồ Tát](quan-the-am-bo-tat) và đọc bài [niệm Địa Tạng Vương Bồ Tát](kinh/niem-dia-tang-vuong-bo-tat) trong mục kinh.',
        ],
      },
      {
        h2: 'Dùng tràng hạt trong ứng dụng',
        p: [
          'Tràng hạt giúp bạn đếm số câu niệm mà không cần nhớ trong đầu. Trong Chùa Liên Hoa, mỗi lần bạn chạm vào một hạt, ứng dụng ghi nhận một câu và phát nhịp mõ nhẹ để giữ nhịp. Chuỗi thường có 108 hạt, tượng trưng cho việc đoạn trừ muôn phiền não. Bạn có thể chọn niệm một vòng, nửa vòng hoặc vài chục hạt tùy thời gian.',
        ],
        list: [
          'Ngồi thẳng lưng, thả lỏng vai, hít vào thật chậm.',
          'Vừa chạm hạt vừa niệm thầm hoặc niệm thành tiếng theo nhịp mõ.',
          'Nếu tâm lơ đãng, không cần trách mình, chỉ cần nhẹ nhàng quay lại câu niệm.',
          'Khi xong, hồi hướng công đức bằng [Kệ hồi hướng](kinh/ke-hoi-huong).',
        ],
      },
      {
        h2: 'Niệm cho đều và bền',
        p: [
          'Điều quý nhất ở niệm Phật là sự đều đặn. Mười phút mỗi ngày tốt hơn hai giờ một lần rồi bỏ dở. Bạn có thể gắn việc niệm Phật với một thói quen có sẵn, như trước khi ngủ hoặc sau bữa sáng. Hãy xem bài [cách niệm Phật](cach-niem-phat) để biết thêm các cách niệm thành tiếng, niệm thầm, niệm theo hơi thở.',
          'Nếu thích tụng một thời ngắn trước khi niệm, bạn có thể mở [Tam Tự Quy](kinh/tam-tu-quy) hoặc [Kệ khai kinh](kinh/ke-khai-kinh). Ngoài ra, [gõ mõ](go-mo-online) đúng nhịp sẽ giúp bạn giữ sự tập trung.',
        ],
      },
      {
        h2: 'Một lời nhắn nhủ',
        p: [
          'Niệm Phật online chỉ là một phương tiện hỗ trợ. Nếu có duyên, hãy đến chùa gần nhà để nghe pháp và học hỏi với quý thầy cô. Ứng dụng này không phải chùa thật, nhưng hy vọng có thể là cánh cửa nhỏ giúp bạn nhớ trở về với chính mình mỗi ngày.',
        ],
      },
    ],
    faq: [
      {
        q: 'Niệm Phật bao lâu mỗi ngày là đủ?',
        a: 'Không có con số cố định. Người mới có thể bắt đầu từ 5 đến 10 phút mỗi ngày, sau đó tăng dần theo khả năng. Điều quan trọng là đều đặn và tâm thanh thản.',
      },
      {
        q: 'Niệm thầm hay niệm thành tiếng thì tốt hơn?',
        a: 'Cả hai đều được. Niệm thành tiếng giúp dễ tập trung khi tâm tán loạn, niệm thầm phù hợp nơi cần yên tĩnh hoặc khi đi đường.',
      },
      {
        q: 'Tràng hạt 108 hạt có ý nghĩa gì?',
        a: 'Con số 108 thường được hiểu là tượng trưng cho vô số phiền não cần chuyển hóa. Bạn không bắt buộc phải niệm đủ một vòng mỗi lần.',
      },
    ],
    related: ['cach-niem-phat', 'go-mo-online', 'thien-online', 'kinh', 'kinh/niem-phat', 'quan-the-am-bo-tat'],
  },
  // ───────────────────────────── thien-online
  {
    slug: 'thien-online',
    title: 'Thiền online – ngồi thiền với đồng hồ hẹn giờ yên tĩnh',
    description:
      'Thiền online trên Chùa Liên Hoa: ngồi thiền theo hơi thở với đồng hồ hẹn giờ, chuông nhẹ báo đầu và cuối thời, cùng hướng dẫn tư thế đơn giản cho người mới.',
    h1: 'Thiền online: vài phút ngồi yên cùng hơi thở',
    sections: [
      {
        h2: 'Thiền là gì và vì sao nên thử?',
        p: [
          'Thiền là thực hành đưa sự chú ý về một điểm, thường là hơi thở, để tâm dần lắng lại và nhìn rõ những gì đang diễn ra bên trong mình. Trong truyền thống Phật giáo, thiền gắn liền với việc nuôi dưỡng sự tỉnh thức và lòng từ bi. Nhưng bạn không cần phải là Phật tử mới ngồi thiền được; nhiều người chỉ đơn giản muốn nghỉ ngơi đầu óc, giảm bớt căng thẳng sau một ngày dài.',
          'Tính năng thiền trong Chùa Liên Hoa (xem thêm [hướng dẫn đi chùa online](huong-dan-di-chua-online)) là một đồng hồ hẹn giờ yên tĩnh: bạn chọn số phút, ứng dụng sẽ gióng một tiếng chuông nhẹ để bắt đầu và một tiếng chuông khi hết giờ. Trong khoảng giữa, không có gì làm bạn xao lãng.',
        ],
      },
      {
        h2: 'Tư thế và cách ngồi cho người mới',
        p: ['Bạn không cần ngồi kiết già. Hãy chọn tư thế nào giúp mình ngồi thoải mái mà lưng vẫn thẳng tự nhiên.'],
        list: [
          'Ngồi trên ghế, hai bàn chân đặt phẳng trên sàn, hai tay đặt nhẹ lên đùi.',
          'Hoặc ngồi xếp bằng trên gối, hông cao hơn đầu gối một chút.',
          'Giữ lưng thẳng nhưng không gồng, vai thả lỏng, cằm hơi thu vào.',
          'Mắt nhắm nhẹ hoặc nhìn xuống khoảng một mét phía trước.',
        ],
      },
      {
        h2: 'Cách theo dõi hơi thở',
        p: [
          'Nếu thích, bạn có thể mở [Tam Tự Quy](kinh/tam-tu-quy) trước khi ngồi. Hãy để hơi thở diễn ra tự nhiên, không cố điều khiển. Bạn có thể đặt sự chú ý nơi cánh mũi, ngực hoặc bụng, chỗ nào cảm giác rõ nhất. Khi hít vào, biết mình đang hít vào; khi thở ra, biết mình đang thở ra. Có thể đếm thầm từ một đến mười rồi quay lại từ đầu. Khi nhận ra tâm đã đi lang thang, đó chính là khoảnh khắc tỉnh thức; hãy mỉm cười nhẹ rồi đưa sự chú ý trở lại hơi thở.',
          'Nếu bạn mới bắt đầu, hãy thử 5 phút mỗi ngày. Khi quen, tăng lên 10, 15 hoặc 20 phút. Bài [thiền cho người mới](thien-cho-nguoi-moi) có thêm các gợi ý để vượt qua buồn ngủ, bồn chồn hay suy nghĩ miên man.',
        ],
      },
      {
        h2: 'Kết hợp với niệm Phật và ngoài trời',
        p: [
          'Bạn có thể kết hợp ngồi thiền với [niệm Phật](niem-phat-online), lấy câu danh hiệu làm đối tượng chú tâm. Nếu có điều kiện, hãy thử [ngồi thiền ngoài trời](ngoi-thien-ngoai-troi) để cảm nhận tiếng chim, làn gió. Sau mỗi thời thiền, đừng vội mở điện thoại; hãy ngồi thêm một lát, rồi nguyện đem sự bình an này chia sẻ đến mọi người.',
        ],
      },
    ],
    faq: [
      {
        q: 'Tôi hay buồn ngủ khi thiền, có sao không?',
        a: 'Rất thường gặp. Bạn có thể mở mắt hờ, ngồi thẳng hơn, rửa mặt trước khi thiền, hoặc chọn thời điểm tỉnh táo hơn trong ngày.',
      },
      {
        q: 'Thiền online có thay được thiền với thầy hướng dẫn không?',
        a: 'Không. Ứng dụng chỉ hỗ trợ bạn tập đều đặn. Nếu muốn đi sâu, hãy tìm khóa thiền hoặc vị thầy phù hợp.',
      },
      {
        q: 'Nên ngồi thiền vào lúc nào trong ngày?',
        a: 'Buổi sáng sớm hoặc trước khi ngủ thường thuận lợi vì yên tĩnh. Quan trọng là chọn giờ bạn có thể giữ đều.',
      },
    ],
    related: ['thien-cho-nguoi-moi', 'ngoi-thien-ngoai-troi', 'niem-phat-online', 'cach-niem-phat', 'huong-dan-di-chua-online'],
  },
  // ───────────────────────────── thap-huong-online
  {
    slug: 'thap-huong-online',
    title: 'Thắp hương online – dâng hương, hoa và nến trong sân chùa',
    description:
      'Thắp hương online trên Chùa Liên Hoa: cách dâng hương, hoa, nến, rung chuông trong sân chùa 3D, ý nghĩa của nén hương và cách giữ tâm thành kính khi lễ.',
    h1: 'Thắp hương online: một nén hương tâm',
    sections: [
      {
        h2: 'Ý nghĩa của nén hương',
        p: [
          'Từ xưa, người Việt thắp hương để bày tỏ lòng thành kính với Phật, với tổ tiên. Làn khói hương bay lên được xem như sợi dây nối tấm lòng người với điều thiêng liêng mà mình hướng về. Trong Phật giáo, hương còn được nhắc đến như một biểu tượng của giới, định, tuệ: mùi hương lan tỏa mà không cần phô trương, như đức hạnh âm thầm của người tu.',
          'Trong ứng dụng, thắp hương là một hành động mô phỏng. Điều có giá trị không nằm ở nén hương ảo, mà ở khoảnh khắc bạn dừng lại, chắp tay, và nghĩ đến một điều lành.',
        ],
      },
      {
        h2: 'Cách thắp hương, dâng hoa và nến trong Chùa Liên Hoa',
        p: ['Bạn có thể thực hiện lần lượt theo thứ tự quen thuộc khi đến chùa:'],
        list: [
          'Đi chậm đến lư hương trước chính điện, chắp tay trong lòng.',
          'Chọn thắp hương: mỗi nén có thể gắn với một lời nguyện của riêng bạn.',
          'Dâng hoa lên bàn thờ, tâm nghĩ đến sự thanh tịnh của hoa sen.',
          'Thắp nến: ánh sáng tượng trưng cho trí tuệ xua tan bóng tối vô minh.',
          'Rung chuông một tiếng để lắng lòng, rồi [niệm Phật](niem-phat-online) hoặc [tụng kinh](kinh).',
        ],
      },
      {
        h2: 'Giữ tâm thành kính khi lễ',
        p: [
          'Thay vì cầu xin nhiều điều, bạn có thể thử đổi cách nghĩ: nén hương này để tri ân cha mẹ, nén hương kia để gửi lòng từ đến những người mình thương và cả những người mình chưa thương. Khi lễ, hãy giữ hơi thở chậm và mỉm cười nhẹ. Sau khi thắp hương, đừng quên [hồi hướng](kinh/ke-hoi-huong) công đức đến muôn loài.',
          'Nếu bạn thắp hương ở nhà thật, hãy chú ý an toàn: đặt hương ở nơi thoáng, xa vật dễ cháy, không để trẻ nhỏ một mình, và dập hương hoàn toàn khi rời đi. Bài [cách lễ Phật tại nhà](cach-le-phat-tai-nha) có thêm hướng dẫn chi tiết.',
        ],
      },
      {
        h2: 'Tinh thần giản dị',
        p: [
          'Lời Phật dạy nhấn mạnh rằng lòng chân thành quan trọng hơn lễ vật. Đừng nghĩ nén hương nào lớn hơn thì phước hơn. Hãy đến với sân chùa online bằng tâm nhẹ nhàng, và nếu có dịp, hãy ghé [chùa vào ngày rằm](di-chua-ram-mung-mot) để cảm nhận bầu không khí thật. Trước khi vào, bạn có thể xem [nội quy](noi-quy) của cộng đồng.',
        ],
      },
    ],
    faq: [
      {
        q: 'Thắp hương online có linh nghiệm như thắp hương thật không?',
        a: 'Đây chỉ là mô phỏng để nhắc bạn dừng lại và hướng tâm. Ứng dụng không hứa hẹn kết quả hay phước báu nào; giá trị nằm ở tâm thành của bạn.',
      },
      {
        q: 'Mỗi lần nên thắp mấy nén hương?',
        a: 'Số nén tùy truyền thống từng nơi; điều cốt yếu là tâm thành. Trong ứng dụng bạn thắp bao nhiêu cũng được.',
      },
      {
        q: 'Thắp hương ở nhà cần lưu ý gì?',
        a: 'Đặt nơi thoáng, tránh vật dễ cháy, trông chừng trẻ nhỏ và thú nuôi, dập tắt hương hoàn toàn khi rời nhà.',
      },
    ],
    related: ['cach-le-phat-tai-nha', 'niem-phat-online', 'go-mo-online', 'di-chua-ram-mung-mot', 'huong-dan-di-chua-online'],
  },
  // ───────────────────────────── noi-quy
  {
    slug: 'noi-quy',
    title: 'Nội quy cộng đồng Chùa Liên Hoa – giữ không gian thanh tịnh',
    description:
      'Nội quy khi vào Chùa Liên Hoa: cách ứng xử hòa nhã trong phòng chung và phòng riêng, quy định tên gọi, câu chào soạn sẵn, nội dung bị cấm và cách báo vi phạm.',
    h1: 'Nội quy chung để cùng giữ sân chùa thanh tịnh',
    sections: [
      {
        h2: 'Tinh thần chung',
        p: [
          'Chùa Liên Hoa là một không gian để mọi người tìm chút yên tĩnh. Vì vậy, nội quy không nhằm kiểm soát mà để bảo vệ sự thanh tịnh ấy cho tất cả. Bạn hãy cư xử như khi bước vào một ngôi chùa thật: nhẹ nhàng, lễ độ, biết lắng nghe. Xin nhớ rằng đây là phần mềm độc lập, không phải chùa thật và không thuộc tổ chức tôn giáo nào, nên mọi người đến đây với nhiều hoàn cảnh và niềm tin khác nhau; hãy tôn trọng sự khác biệt đó.',
        ],
      },
      {
        h2: 'Những điều nên làm',
        p: ['Một số gợi ý để mọi người cùng có trải nghiệm tốt:'],
        list: [
          'Chọn tên gọi hoặc pháp danh lịch sự, dễ đọc.',
          'Dùng các câu chào soạn sẵn như “A Di Đà Phật”, “Chúc bình an”, “Tùy hỷ” để chào hỏi, cảm ơn và rủ nhau cùng [niệm Phật](niem-phat-online).',
          'Bước chậm trong sân chùa, không chạy nhảy hay chạy vòng vòng gây rối.',
          'Giữ yên lặng khi người khác đang [tụng kinh](kinh) hoặc [ngồi thiền](thien-online).',
          'Nếu bạn muốn công phu riêng, hãy tạo phòng riêng thay vì vào phòng chung.',
        ],
      },
      {
        h2: 'Những điều không nên',
        p: ['Để giữ không gian trong lành, xin vui lòng không:'],
        list: [
          'Dùng tên gọi mang tính xúc phạm, quảng cáo, chứa thông tin liên hệ cá nhân hoặc mạo danh người khác, mạo danh quý thầy cô.',
          'Gây rối, đứng chắn lối, làm phiền người khác cố ý.',
          'Tranh luận về chính trị, tôn giáo hay công kích người khác dưới mọi hình thức.',
          'Lợi dụng ứng dụng để kêu gọi quyên góp, bán hàng hoặc chiêu dụ.',
          'Cố tình khai thác lỗi phần mềm để gian lận cấp độ hay chuỗi ngày.',
        ],
      },
      {
        h2: 'Vì sao không có khung chat tự do?',
        p: [
          'Chúng tôi chỉ cho phép dùng các câu chào soạn sẵn để giữ không khí hòa nhã, tránh những lời nói làm xao động người khác, và bảo vệ người dùng nhỏ tuổi. Đây là lựa chọn có chủ ý, không phải thiếu sót. Nếu bạn muốn trò chuyện sâu hơn, hãy gặp bạn đạo ở ngoài đời thực, hoặc đến chùa gần nhà.',
        ],
      },
      {
        h2: 'Khi có vấn đề',
        p: [
          'Nếu gặp ai đó cư xử chưa phù hợp, bạn có thể tránh xa, rời phòng hoặc báo cho chúng tôi qua phần góp ý trong ứng dụng. Chúng tôi có thể nhắc nhở, tạm hạn chế hoặc khóa tài khoản trong trường hợp nghiêm trọng. Chi tiết xem thêm ở [điều khoản sử dụng](dieu-khoan-su-dung). Nếu còn băn khoăn, mời bạn xem [hỏi đáp](hoi-dap) hoặc đọc lại [giới thiệu](gioi-thieu). Xin cảm ơn bạn đã cùng gìn giữ sân chùa.',
        ],
      },
    ],
    faq: [
      {
        q: 'Tôi có thể đặt pháp danh làm tên gọi không?',
        a: 'Được, miễn là tên lịch sự và không mạo danh quý thầy cô hay người khác.',
      },
      {
        q: 'Vì sao tôi không gõ được tin nhắn tự do?',
        a: 'Ứng dụng chỉ cho dùng câu chào soạn sẵn để giữ không gian hòa nhã và an toàn cho mọi người.',
      },
    ],
    related: ['gioi-thieu', 'dieu-khoan-su-dung', 'chinh-sach-quyen-rieng-tu', 'hoi-dap', 'huong-dan-di-chua-online'],
  },
  // ───────────────────────────── go-mo-online
  {
    slug: 'go-mo-online',
    title: 'Gõ mõ online – tụng kinh theo nhịp mõ trên Chùa Liên Hoa',
    description:
      'Gõ mõ online: tìm hiểu vai trò của mõ khi tụng kinh, cách gõ đúng nhịp, luyện nhịp đều và dùng chế độ chữ chạy theo nhịp mõ để tụng kinh thuận lợi mỗi ngày.',
    h1: 'Gõ mõ online: giữ nhịp cho một thời kinh',
    sections: [
      {
        h2: 'Mõ trong nghi thức tụng kinh',
        p: [
          'Mõ, thường gọi là mõ gỗ hay mõ cá, là pháp khí quen thuộc trong các buổi tụng kinh ở chùa Việt Nam. Tiếng mõ đều đặn giúp đại chúng giữ nhịp, đọc cùng tốc độ và cùng ngắt nghỉ. Người xưa ví tiếng mõ như một lời nhắc nhở: đừng để tâm trôi đi, hãy quay lại với câu kinh đang đọc. Cá là loài ngủ mắt mở, nên hình dáng con cá trên mõ còn gợi sự tỉnh thức, siêng năng tinh tấn.',
        ],
      },
      {
        h2: 'Cách dùng mõ trong ứng dụng',
        p: [
          'Khi mở một bài [kinh](kinh), bạn có thể bật chế độ nhịp mõ. Từng chữ trong kinh sẽ sáng lên theo mỗi tiếng mõ, giúp bạn đọc cùng nhịp mà không cần ai hướng dẫn. Bạn có thể chỉnh tốc độ chậm hơn nếu mới tập, và nhanh dần khi đã thuộc. Với bài ngắn như [Tam Tự Quy](kinh/tam-tu-quy) hay [Niệm Phật](kinh/niem-phat), nhịp mõ rất dễ nắm.',
        ],
        list: [
          'Chọn một bài ngắn để làm quen với nhịp.',
          'Đọc nhẹ nhàng, không gồng giọng; âm lượng vừa đủ nghe.',
          'Mỗi chữ trùng một tiếng mõ; câu dài thì ngắt ở chỗ nghỉ tự nhiên.',
          'Khi lạc nhịp, đừng cố đuổi, hãy chờ nhịp tiếp theo rồi vào lại.',
        ],
      },
      {
        h2: 'Luyện nhịp đều và tâm yên',
        p: [
          'Gõ mõ không phải để chạy đua. Một nhịp chậm, đều, hơi nhỉnh hơn nhịp thở sẽ giúp bạn tụng lâu mà không mệt. Hãy hít vào ở chỗ ngắt câu, thở ra khi đọc. Bạn sẽ thấy nhịp mõ, nhịp thở và nhịp tâm dần hòa vào nhau. Sau một vài buổi, nhiều người nhận ra mình đã thuộc kinh lúc nào không hay.',
          'Nếu thích, hãy bắt đầu bằng một tiếng chuông ở [sân chùa](thap-huong-online), rồi tụng [Kệ khai kinh](kinh/ke-khai-kinh), kết thúc bằng [Kệ hồi hướng](kinh/ke-hoi-huong). Bạn cũng có thể kết hợp gõ mõ với [niệm Phật](niem-phat-online) bằng tràng hạt.',
        ],
      },
      {
        h2: 'Lưu ý khi tụng kinh',
        p: [
          'Trước khi tụng, hãy đọc phần giới thiệu của mỗi bài để hiểu ý nghĩa; bài [ý nghĩa từng kinh](y-nghia-tung-kinh) là nơi bắt đầu tốt. Kinh văn trong ứng dụng được tổng hợp từ bản tụng phổ biến; nếu có điều kiện, hãy đối chiếu với bản in của chùa quen thuộc.',
        ],
      },
    ],
    faq: [
      {
        q: 'Mõ có bắt buộc khi tụng kinh không?',
        a: 'Không bắt buộc, nhưng giúp giữ nhịp và giữ sự tập trung, nhất là khi tụng đông người.',
      },
      {
        q: 'Tôi chưa thuộc kinh thì có gõ mõ được không?',
        a: 'Được. Chữ chạy theo nhịp mõ giúp bạn đọc theo mà chưa cần thuộc lòng.',
      },
      {
        q: 'Tôi nên bắt đầu với bài kinh nào?',
        a: 'Hãy thử Tam Tự Quy, Niệm Phật hoặc Kệ khai kinh vì ngắn, dễ nhớ.',
      },
    ],
    related: ['niem-phat-online', 'y-nghia-tung-kinh', 'kinh', 'thap-huong-online', 'cach-niem-phat'],
  },
  // ───────────────────────────── xin-que-online
  {
    slug: 'xin-que-online',
    title: 'Xin quẻ online cho vui – lời nhắc tích cực mỗi ngày',
    description:
      'Xin quẻ online trên Chùa Liên Hoa là trò vui nhẹ nhàng: mỗi quẻ là một bài thơ và lời nhắc tu tập tích cực, không bói toán và không dự đoán vận mệnh.',
    h1: 'Xin quẻ online: một lời nhắc nhẹ nhàng, không phải bói toán',
    sections: [
      {
        h2: 'Xin quẻ trong Chùa Liên Hoa là gì?',
        p: [
          'Ở nhiều ngôi chùa, người ta có tục rút một lá xăm rồi đọc bài thơ ghi trên đó. Chùa Liên Hoa mượn hình thức quen thuộc ấy để tạo ra một trò vui nhẹ nhàng. Khi bạn “xin quẻ”, ứng dụng chọn ngẫu nhiên một trong 60 quẻ, mỗi quẻ gồm tên quẻ, bốn câu thơ do chúng tôi tự sáng tác và một lời giải ngắn.',
          'Điều cần nói rõ: đây không phải bói toán. Quẻ không dự đoán tương lai, không phán về tiền bạc, tình duyên hay sức khỏe. Mỗi quẻ chỉ là một lời nhắc tích cực, ví dụ nhớ thở chậm, nói lời dịu dàng, biết ơn những điều nhỏ bé. Hãy xem như đang đọc một dòng chữ khích lệ vào buổi sáng.',
        ],
      },
      {
        h2: 'Cách xin quẻ',
        p: ['Bạn có thể làm theo các bước sau để việc xin quẻ thành một khoảnh khắc chậm rãi:'],
        list: [
          'Đến gần bàn xăm trong sân chùa, hít vào một hơi thật sâu.',
          'Nghĩ đến một điều bạn muốn nhìn lại, chẳng hạn cách mình đối xử với người thân.',
          'Chọn rút quẻ và đọc chậm bài thơ.',
          'Dừng lại một chút, hỏi mình: lời nhắc này giúp gì cho ngày hôm nay?',
        ],
      },
      {
        h2: 'Cách nhìn lành mạnh về quẻ',
        p: [
          'Trong lời Phật dạy, hạnh phúc hay khổ đau phần lớn đến từ cách ta nghĩ, nói và làm, chứ không phải từ một lá xăm. Vì thế, hãy đừng dùng quẻ để quyết định những việc hệ trọng như chữa bệnh, đầu tư hay chuyện gia đình. Khi cần, hãy hỏi người có chuyên môn và người thân đáng tin cậy.',
          'Nếu quẻ rút được không hợp ý, hãy rút lại hoặc bỏ qua, vì đây chỉ là một trò vui. Điều đáng giữ lại là sự lắng lại vài phút. Bạn có thể tiếp nối bằng cách [niệm Phật](niem-phat-online), [ngồi thiền](thien-online) hoặc đọc một bài [kinh ngắn](kinh).',
        ],
      },
      {
        h2: 'Lưu ý',
        p: [
          'Chùa Liên Hoa là phần mềm độc lập, không phải chùa thật; bạn có thể đọc thêm ở trang [giới thiệu](gioi-thieu). Nếu có điều gì thắc mắc về cách dùng, xin xem phần [hỏi đáp](hoi-dap). Muốn nghe thêm những lời dạy sâu hơn, bạn có thể ghé mục [pháp thoại](phap-thoai).',
        ],
      },
    ],
    faq: [
      {
        q: 'Xin quẻ online có chính xác không?',
        a: 'Quẻ chỉ mang tính giải trí và nhắc nhở tích cực, không có chức năng dự đoán, nên không có khái niệm đúng hay sai.',
      },
      {
        q: 'Một ngày tôi được xin mấy quẻ?',
        a: 'Bạn có thể rút nhiều lần, nhưng nên dừng ở một quẻ để suy ngẫm kỹ hơn là rút liên tục.',
      },
      {
        q: 'Tôi có nên tin vào quẻ không?',
        a: 'Hãy xem quẻ như một dòng nhắc nhẹ nhàng, đừng dùng để quyết định các việc lớn trong đời.',
      },
    ],
    related: ['phap-thoai', 'niem-phat-online', 'thien-online', 'hoi-dap', 'gioi-thieu'],
  },
  // ───────────────────────────── phap-thoai
  {
    slug: 'phap-thoai',
    title: 'Pháp thoại online – gợi ý nghe giảng, lời dạy nhẹ nhàng',
    description:
      'Gợi ý cách nghe pháp thoại online hiệu quả: chọn chủ đề phù hợp, nghe với tâm lắng, ghi chú, áp dụng lời dạy vào đời sống và lưu ý khi chọn nguồn nghe.',
    h1: 'Pháp thoại online: nghe để hiểu và sống tốt hơn',
    sections: [
      {
        h2: 'Pháp thoại là gì?',
        p: [
          'Pháp thoại là buổi nói chuyện về Phật pháp của một vị thầy hay một giảng sư, nhằm giải thích kinh điển, chia sẻ kinh nghiệm tu học và gợi ý cách áp dụng lời Phật dạy vào cuộc sống. Ngày nay, nhờ Internet, nhiều pháp thoại được thu âm, quay hình và chia sẻ rộng rãi, giúp những ai ở xa chùa vẫn có thể nghe và học hỏi.',
          'Mục pháp thoại trong Chùa Liên Hoa tập hợp một số gợi ý dưới dạng liên kết tìm kiếm theo chủ đề trên các nền tảng video công khai. Chúng tôi không sản xuất các bài giảng ấy, và ứng dụng không đại diện cho vị thầy nào.',
        ],
      },
      {
        h2: 'Chọn chủ đề phù hợp',
        p: ['Nếu bạn mới bắt đầu, hãy chọn các chủ đề gần gũi với đời sống:'],
        list: [
          'Hiếu hạnh và báo ân cha mẹ, nhân [mùa Vu Lan](le-vu-lan).',
          'Cách [niệm Phật](cach-niem-phat) và giữ tâm bình an.',
          'Thiền và chánh niệm trong sinh hoạt hằng ngày, như bài [thiền cho người mới](thien-cho-nguoi-moi).',
          'Ý nghĩa của các bài [kinh thường tụng](y-nghia-tung-kinh).',
          'Lòng từ bi, tha thứ và buông bỏ giận hờn.',
        ],
      },
      {
        h2: 'Nghe pháp với tâm lắng',
        p: [
          'Nghe pháp không giống xem giải trí. Hãy chọn một lúc yên tĩnh, ngồi thẳng, tắt các thông báo. Có thể thắp một nén hương hoặc chỉ cần hít thở vài lần trước khi nghe. Nếu gặp ý khó hiểu, đừng vội phán xét; hãy ghi lại và tìm hiểu thêm. Mỗi buổi nghe, chỉ cần chọn một điều nhỏ để thực hành trong ngày, ví dụ nói lời dịu dàng hơn hoặc nghĩ tốt hơn về một người.',
        ],
      },
      {
        h2: 'Lưu ý khi chọn nguồn',
        p: [
          'Trên mạng có nhiều nội dung tự xưng là Phật pháp nhưng pha trộn mê tín, hứa hẹn tài lộc hay kêu gọi đóng góp. Hãy ưu tiên các bài giảng từ những vị thầy, ngôi chùa hoặc tổ chức có uy tín, nội dung phù hợp với kinh điển, không đòi hỏi tiền bạc để “giải hạn”. Khi có nghi ngờ, bạn nên hỏi quý thầy cô tại chùa gần nhà. Bạn cũng có thể đọc các bài tổng quan như [ngày lễ Phật giáo](ngay-le-phat-giao) để có kiến thức nền trước khi nghe pháp.',
        ],
      },
    ],
    faq: [
      {
        q: 'Pháp thoại trong ứng dụng do ai giảng?',
        a: 'Chùa Liên Hoa không sản xuất pháp thoại. Ứng dụng chỉ gợi ý liên kết tìm kiếm theo chủ đề trên các nền tảng công khai.',
      },
      {
        q: 'Người mới nên nghe chủ đề nào trước?',
        a: 'Hãy bắt đầu từ các chủ đề gần gũi như hiếu hạnh, thiền hơi thở, niệm Phật hay cách giữ tâm bình an.',
      },
    ],
    related: ['y-nghia-tung-kinh', 'le-vu-lan', 'thien-cho-nguoi-moi', 'cach-niem-phat', 'ngay-le-phat-giao', 'kinh'],
  },
  // ───────────────────────────── lich-am
  {
    slug: 'lich-am',
    title: 'Lịch âm hôm nay – cách xem ngày rằm, mùng một, lễ Phật giáo',
    description:
      'Lịch âm hôm nay và cách đọc lịch âm: ngày mùng một, ngày rằm, tháng đủ tháng thiếu, tháng nhuận, và các ngày vía, ngày lễ Phật giáo theo âm lịch trong năm.',
    h1: 'Lịch âm dương: xem ngày rằm, mùng một và các ngày lễ Phật giáo',
    sections: [
      {
        h2: 'Cách đọc lịch âm',
        p: [
          'Lịch âm mà người Việt thường dùng thực chất là âm dương lịch: tháng tính theo chu kỳ của mặt trăng, năm điều chỉnh theo mặt trời. Mỗi tháng âm có 29 hoặc 30 ngày, gọi là tháng thiếu hoặc tháng đủ. Ngày đầu tháng là mùng một, khi trăng gần như không nhìn thấy; ngày 15 là ngày rằm, thường là lúc trăng tròn. Vì năm âm ngắn hơn năm dương khoảng 11 ngày, cứ khoảng ba năm lại có một tháng nhuận để lịch khớp với các mùa.',
          'Mỗi ô ngày trong lịch thường ghi ngày dương lớn và ngày âm nhỏ hơn. Khi ngày âm là mùng một của tháng mới, lịch hay ghi kèm tên tháng, ví dụ “1/4”. Lịch ở phần trên trang này sẽ tự cập nhật theo ngày hiện tại để bạn xem nhanh hôm nay là ngày mấy âm lịch.',
        ],
      },
      {
        h2: 'Mùng một và rằm trong đời sống Phật tử',
        p: [
          'Với nhiều gia đình, ngày mùng một và ngày rằm là dịp đến chùa lễ Phật, ăn chay, làm việc thiện. Bạn có thể tìm hiểu thêm ở bài [ngày rằm, mùng một](ngay-ram-mung-mot) và [đi chùa mùng một, rằm](di-chua-ram-mung-mot). Nếu chưa thể đến chùa, bạn có thể [lễ Phật tại nhà](cach-le-phat-tai-nha) hoặc ghé sân chùa trong Chùa Liên Hoa để [niệm Phật](niem-phat-online).',
        ],
      },
      {
        h2: 'Các ngày lễ lớn theo âm lịch',
        p: ['Dưới đây là những ngày thường được biết đến, tính theo âm lịch:'],
        list: [
          'Mùng 1 tháng Giêng: Tết Nguyên đán, ngày đầu năm mới; nhiều người đến chùa đầu năm, xem bài [đi chùa đầu năm](di-chua-dau-nam).',
          'Ngày 15 tháng Giêng: Rằm tháng Giêng (Thượng nguyên).',
          'Ngày 19 tháng 2: Vía Quán Thế Âm Bồ Tát, cũng được nhớ vào 19/6 và 19/9, xem [Quan Thế Âm Bồ Tát](quan-the-am-bo-tat).',
          'Ngày 15 tháng 4: Phật Đản, xem bài [lễ Phật Đản](phat-dan).',
          'Ngày 15 tháng 7: Vu Lan, xem bài [lễ Vu Lan](le-vu-lan).',
          'Ngày 8 tháng 12: ngày Đức Phật thành đạo.',
          'Ngày 17 tháng 11: Vía Đức Phật A Di Đà.',
        ],
      },
      {
        h2: 'Lưu ý khi xem lịch',
        p: [
          'Ngày âm lịch của Việt Nam được tính theo múi giờ của nước ta, nên đôi khi có thể chênh một ngày so với lịch của nước khác. Một số chùa còn có cách tính ngày vía hay lịch riêng theo truyền thống từng nơi, nên nếu định đến chùa, bạn hãy hỏi lại chùa đó. Danh sách đầy đủ hơn về ngày lễ, mời xem bài [ngày lễ Phật giáo](ngay-le-phat-giao).',
        ],
      },
    ],
    faq: [
      {
        q: 'Tháng nhuận là gì?',
        a: 'Là tháng được thêm vào khoảng ba năm một lần để năm âm lịch khớp với các mùa của năm dương. Tháng nhuận lặp lại số của một tháng trước đó.',
      },
      {
        q: 'Vì sao ngày rằm không phải lúc nào cũng trăng tròn đúng ngày 15?',
        a: 'Chu kỳ trăng khoảng 29,5 ngày nên trăng tròn có thể rơi vào ngày 14, 15 hoặc 16 âm lịch tùy tháng.',
      },
      {
        q: 'Lịch trên trang này có đáng tin không?',
        a: 'Lịch được tính bằng thuật toán âm lịch cho múi giờ Việt Nam. Với việc quan trọng, bạn hãy đối chiếu thêm với lịch chính thức hoặc hỏi chùa.',
      },
    ],
    related: ['ngay-ram-mung-mot', 'ngay-le-phat-giao', 'phat-dan', 'le-vu-lan', 'di-chua-ram-mung-mot', 'di-chua-dau-nam'],
  },
  // ───────────────────────────── ngay-ram-mung-mot
  {
    slug: 'ngay-ram-mung-mot',
    title: 'Ngày rằm và mùng một – ý nghĩa và cách giữ nếp tu tập',
    description:
      'Tìm hiểu ý nghĩa ngày rằm và mùng một âm lịch trong đời sống Phật tử Việt Nam: vì sao đi chùa, ăn chay, làm việc thiện và cách đón ngày này an lạc, giản dị.',
    h1: 'Ngày rằm, mùng một: dừng lại để gieo điều lành',
    sections: [
      {
        h2: 'Mùng một và rằm là những ngày nào?',
        p: [
          'Theo âm lịch, mùng một là ngày đầu mỗi tháng, còn rằm là ngày 15, khi trăng thường tròn nhất. Hai ngày này đánh dấu hai nửa của tháng, nên từ lâu người Việt có thói quen dừng lại, nhìn lại mình và làm điều tốt lành. Để biết hôm nay là ngày mấy âm lịch, bạn có thể xem [lịch âm](lich-am) trên Chùa Liên Hoa.',
        ],
      },
      {
        h2: 'Vì sao nhiều người đi chùa, ăn chay vào hai ngày này?',
        p: [
          'Trong truyền thống Phật giáo Việt Nam, ngày mùng một và rằm là dịp để Phật tử đến chùa lễ Phật, nghe pháp, tụng kinh và sám hối. Nhiều chùa tổ chức lễ sám hối hoặc tụng kinh vào các ngày này. Việc ăn chay vào mùng một và rằm là một nếp đẹp: bớt sát sinh, giữ lòng từ bi, đồng thời cho thân tâm nhẹ nhàng. Dĩ nhiên, ăn chay hay không tùy hoàn cảnh sức khỏe và duyên của mỗi người, không có gì ép buộc.',
          'Cốt lõi của hai ngày này không nằm ở lễ vật mà ở tâm. Một nén hương thành tâm, một bữa cơm chay giản dị, một lời xin lỗi chân thành còn quý hơn mâm cao cỗ đầy.',
        ],
      },
      {
        h2: 'Gợi ý cách đón mùng một và rằm',
        p: ['Bạn không cần làm cầu kỳ. Một vài việc nhỏ dưới đây cũng đủ làm ngày trở nên ý nghĩa:'],
        list: [
          'Dọn dẹp bàn thờ hoặc góc thờ, thay nước, cắm hoa tươi.',
          '[Lễ Phật tại nhà](cach-le-phat-tai-nha) hoặc [đi chùa](di-chua-ram-mung-mot) nếu có thể.',
          'Dành mười đến ba mươi phút [niệm Phật](niem-phat-online) hoặc tụng một bài [kinh ngắn](kinh).',
          'Ăn một bữa chay nhẹ nhàng, ăn chậm và biết ơn thức ăn.',
          'Làm một việc thiện nhỏ: giúp đỡ hàng xóm, thăm người ốm, gọi điện cho cha mẹ.',
          'Tối đến ngắm trăng rằm, ngồi [thiền](thien-online) vài phút.',
        ],
      },
      {
        h2: 'Với người ở xa chùa hay bận rộn',
        p: [
          'Nếu công việc không cho phép bạn đến chùa, đừng tự trách. Bạn có thể ghé sân chùa online, thắp hương, rung chuông, niệm Phật cùng bạn đạo trong phòng chung. Chùa Liên Hoa không phải chùa thật và không thay thế việc đến chùa, nhưng hy vọng giúp bạn giữ được nếp nhớ ngày rằm, mùng một. Muốn biết thêm về các ngày lễ khác trong năm, mời xem bài [ngày lễ Phật giáo](ngay-le-phat-giao).',
        ],
      },
    ],
    faq: [
      {
        q: 'Mùng một và rằm có bắt buộc phải ăn chay không?',
        a: 'Không bắt buộc. Đó là nếp đẹp của nhiều Phật tử, tùy sức khỏe và hoàn cảnh mỗi người.',
      },
      {
        q: 'Nên cúng gì vào ngày rằm?',
        a: 'Đơn giản là hương, hoa, nước sạch, trái cây, hoặc mâm cơm chay. Điều quan trọng là tâm thành, không cần cầu kỳ.',
      },
      {
        q: 'Không đến chùa được thì làm gì?',
        a: 'Bạn có thể lễ Phật tại nhà, niệm Phật, tụng kinh, hoặc làm một việc thiện nhỏ trong ngày.',
      },
    ],
    related: ['lich-am', 'di-chua-ram-mung-mot', 'cach-le-phat-tai-nha', 'ngay-le-phat-giao', 'niem-phat-online'],
  },
  // ───────────────────────────── ngay-le-phat-giao
  {
    slug: 'ngay-le-phat-giao',
    title: 'Ngày lễ Phật giáo trong năm theo âm lịch – Tổng hợp đầy đủ',
    description:
      'Tổng hợp các ngày lễ, ngày vía Phật giáo theo âm lịch: Tết, rằm tháng Giêng, Phật Đản, Vu Lan, Thành đạo, vía Quan Âm, vía A Di Đà và ý nghĩa từng ngày.',
    h1: 'Các ngày lễ Phật giáo trong năm và ý nghĩa',
    sections: [
      {
        h2: 'Vì sao cần nhớ các ngày lễ?',
        p: [
          'Các ngày lễ và ngày vía trong Phật giáo là dịp để người học Phật nhớ lại cuộc đời, hạnh nguyện của chư Phật, chư Bồ Tát, từ đó soi lại mình và tinh tấn hơn. Hầu hết đều tính theo âm lịch, nên bạn có thể mở [lịch âm](lich-am) để đối chiếu ngày dương. Dưới đây là những ngày được nhiều người nhắc đến; một số chùa có thể có cách tổ chức hoặc tính ngày riêng theo truyền thống từng nơi.',
        ],
      },
      {
        h2: 'Đầu năm: Tết và rằm tháng Giêng',
        p: [
          'Mùng 1 tháng Giêng là Tết Nguyên đán. Nhiều gia đình đến chùa lễ Phật đầu năm, cầu cho mọi người bình an; xem thêm bài [đi chùa đầu năm](di-chua-dau-nam). Ngày 15 tháng Giêng là rằm tháng Giêng, còn gọi là Thượng nguyên, ngày đầu tiên trong năm có trăng tròn, thường có lễ dâng hương, tụng kinh tại chùa.',
        ],
      },
      {
        h2: 'Các ngày lễ chính trong năm',
        p: ['Dưới đây là các ngày thường được tổ chức lễ ở nhiều chùa Việt Nam:'],
        list: [
          'Ngày 19 tháng 2 âm lịch: Vía Quán Thế Âm Bồ Tát, thường được nhắc là ngày đản sinh; cùng với 19/6 (thành đạo) và 19/9 (xuất gia). Xem [Quan Thế Âm Bồ Tát](quan-the-am-bo-tat).',
          'Ngày 15 tháng 4: Phật Đản, kỷ niệm ngày đản sinh Thái tử Tất Đạt Đa. Xem [lễ Phật Đản](phat-dan).',
          'Ngày 15 tháng 7: lễ Vu Lan, dịp báo hiếu cha mẹ. Xem [lễ Vu Lan](le-vu-lan).',
          'Ngày 17 tháng 11: Vía Đức Phật A Di Đà, vị Phật được nhắc trong [Kinh A Di Đà](kinh/kinh-a-di-da).',
          'Ngày 8 tháng 12: ngày Đức Phật thành đạo dưới cội [bồ đề](cay-bo-de).',
        ],
      },
      {
        h2: 'Hằng tháng: mùng một và rằm',
        p: [
          'Ngoài những ngày lớn, mỗi tháng còn có hai ngày mùng một và rằm, như đã nói ở bài [ngày rằm, mùng một](ngay-ram-mung-mot). Nhiều Phật tử xem đây là dịp đều đặn để đến chùa, ăn chay, sám hối và làm việc thiện.',
        ],
      },
      {
        h2: 'Cách đón ngày lễ cho thật ý nghĩa',
        p: [
          'Dù là ngày lễ nào, cốt lõi vẫn là hiểu và noi theo hạnh của chư Phật, chư Bồ Tát. Bạn có thể đọc một bài kinh liên quan, nghe một buổi [pháp thoại](phap-thoai), [thắp hương](thap-huong-online) hoặc [thả đèn hoa đăng](tha-den-hoa-dang) trong ứng dụng, rồi làm một việc thiện ngoài đời. Chùa Liên Hoa là phần mềm độc lập, không phải chùa thật; nếu có thể, hãy đến chùa gần nhà để cùng đại chúng tham dự lễ.',
        ],
      },
    ],
    faq: [
      {
        q: 'Lễ Phật Đản vào ngày nào?',
        a: 'Theo truyền thống Việt Nam, Phật Đản được tổ chức vào ngày 15 tháng 4 âm lịch.',
      },
      {
        q: 'Ngày Vu Lan là ngày nào?',
        a: 'Lễ Vu Lan rơi vào ngày rằm tháng 7 âm lịch.',
      },
      {
        q: 'Ngày vía Quan Âm có mấy ngày trong năm?',
        a: 'Thường nhắc đến ba ngày: 19 tháng 2, 19 tháng 6 và 19 tháng 9 âm lịch.',
      },
    ],
    related: ['lich-am', 'phat-dan', 'le-vu-lan', 'quan-the-am-bo-tat', 'ngay-ram-mung-mot', 'di-chua-dau-nam'],
  },
  // ───────────────────────────── cach-le-phat-tai-nha
  {
    slug: 'cach-le-phat-tai-nha',
    title: 'Cách lễ Phật tại nhà đơn giản, thành tâm và an toàn',
    description:
      'Hướng dẫn cách lễ Phật tại nhà đơn giản: chuẩn bị bàn thờ, hương hoa, trình tự lạy, tụng kinh ngắn, hồi hướng và những lưu ý an toàn khi thắp hương trong nhà.',
    h1: 'Lễ Phật tại nhà: giản dị mà thành tâm',
    sections: [
      {
        h2: 'Chuẩn bị không gian lễ Phật',
        p: [
          'Không phải ai cũng có điều kiện đến chùa thường xuyên, nên nhiều gia đình lập một góc thờ Phật trang nghiêm ngay tại nhà. Hãy chọn một nơi sạch sẽ, thoáng đãng, tránh đặt trong phòng ngủ hay gần nhà vệ sinh, bếp. Nếu nhà chật, một chiếc kệ nhỏ treo cao với tượng hoặc ảnh Phật cũng đủ. Điều quan trọng không phải đồ thờ đắt tiền mà là sự ngăn nắp và lòng kính trọng.',
          'Lễ vật có thể chỉ gồm một bình hoa tươi, một chén nước sạch, một lư hương và đĩa trái cây. Với dịp [mùng một và rằm](ngay-ram-mung-mot), bạn có thể thêm một mâm cơm chay giản dị.',
        ],
      },
      {
        h2: 'Trình tự lễ Phật đơn giản',
        p: ['Bạn có thể làm theo trình tự sau, rồi điều chỉnh cho phù hợp với gia đình:'],
        list: [
          'Rửa tay, mặc quần áo gọn gàng, giữ tâm yên tĩnh.',
          'Thắp hương, đứng chắp tay, giữ hơi thở chậm. Xem thêm bài [thắp hương online](thap-huong-online) để hiểu ý nghĩa nén hương.',
          'Lễ ba lạy, nghĩ đến Phật, Pháp, Tăng; có thể niệm [Tam Tự Quy](kinh/tam-tu-quy).',
          'Tụng một bài kinh ngắn như [Kệ khai kinh](kinh/ke-khai-kinh) hoặc [Tâm Kinh](kinh/bat-nha-tam-kinh), hoặc [niệm Phật](niem-phat-online).',
          'Hồi hướng công đức bằng [Kệ hồi hướng](kinh/ke-hoi-huong) rồi lễ tạ.',
        ],
      },
      {
        h2: 'Lưu ý an toàn',
        p: [
          'Thắp hương trong nhà cần chú ý: đặt lư hương trên bề mặt chắc chắn, cách xa rèm cửa, giấy và vật dễ cháy. Không để nến cháy khi vắng người, không để trẻ nhỏ hoặc thú nuôi chạm vào. Dùng ít hương, mở cửa sổ cho thông thoáng, đặc biệt nếu trong nhà có người hen suyễn hoặc người già. Khi xong, hãy kiểm tra hương và nến đã tắt hẳn.',
        ],
      },
      {
        h2: 'Tâm quan trọng hơn hình thức',
        p: [
          'Không có một cách lễ Phật duy nhất. Mỗi vùng, mỗi chùa có thể hướng dẫn hơi khác nhau; điều cốt yếu là sự thành kính và hiểu biết đúng đắn, không mê tín. Nếu băn khoăn về nghi thức, hãy hỏi quý thầy cô tại chùa quen thuộc. Khi chưa thể đến chùa, bạn có thể ghé sân chùa trong Chùa Liên Hoa (phần mềm độc lập, không phải chùa thật) để có thêm cảm hứng. Xem thêm bài [hướng dẫn đi chùa online](huong-dan-di-chua-online).',
        ],
      },
    ],
    faq: [
      {
        q: 'Nhà chật có thể lập góc thờ Phật không?',
        a: 'Được. Một kệ nhỏ đặt cao, sạch sẽ, thoáng đãng là đủ; quan trọng là sự trang nghiêm và lòng kính trọng.',
      },
      {
        q: 'Một ngày nên lễ Phật mấy lần?',
        a: 'Tùy điều kiện từng người. Nhiều người lễ vào buổi sáng hoặc tối, dành vài phút đều đặn.',
      },
      {
        q: 'Có cần thuộc nhiều kinh mới lễ Phật tại nhà được không?',
        a: 'Không. Bạn chỉ cần một bài ngắn như Tam Tự Quy hoặc niệm danh hiệu Phật cũng đã đủ.',
      },
    ],
    related: ['thap-huong-online', 'niem-phat-online', 'cach-niem-phat', 'ngay-ram-mung-mot', 'kinh', 'di-chua-ram-mung-mot'],
  },
  // ───────────────────────────── cach-niem-phat
  {
    slug: 'cach-niem-phat',
    title: 'Cách niệm Phật cho người mới: tư thế, hơi thở, thời gian',
    description:
      'Hướng dẫn cách niệm Phật cho người mới bắt đầu: chọn danh hiệu, niệm thành tiếng hay niệm thầm, phối hợp hơi thở, đếm hạt và giữ thói quen lâu dài mỗi ngày.',
    h1: 'Cách niệm Phật đơn giản cho người mới bắt đầu',
    sections: [
      {
        h2: 'Chọn danh hiệu để niệm',
        p: [
          'Câu niệm phổ biến nhất ở Việt Nam là “Nam mô A Di Đà Phật”. Ngoài ra, nhiều người niệm “Nam mô Quán Thế Âm Bồ Tát” hoặc “Nam mô Địa Tạng Vương Bồ Tát”. Hãy chọn một danh hiệu mà bạn thấy gần gũi và niệm đều đặn, thay vì thay đổi liên tục. Bạn có thể tìm hiểu thêm ở các bài [niệm Phật](kinh/niem-phat), [Quan Thế Âm Bồ Tát](quan-the-am-bo-tat) và [niệm Địa Tạng](kinh/niem-dia-tang-vuong-bo-tat) trong mục kinh.',
        ],
      },
      {
        h2: 'Ba cách niệm thông dụng',
        p: ['Tùy hoàn cảnh, bạn có thể chọn một trong các cách sau:'],
        list: [
          'Niệm thành tiếng: phát âm rõ ràng, nhịp đều, thích hợp khi tâm hay tán loạn.',
          'Niệm thầm: niệm trong tâm, không ra tiếng, thích hợp khi đi đường, trên xe hay nơi đông người.',
          'Niệm theo hơi thở: một câu cho một hơi hít vào và thở ra, hoặc chia câu niệm thành hai nửa theo nhịp thở.',
        ],
      },
      {
        h2: 'Các bước thực hành',
        p: [
          'Trước tiên, ngồi hoặc đứng ở nơi yên tĩnh, thả lỏng vai và hít thở sâu vài lần. Sau đó bắt đầu niệm, vừa niệm vừa nghe rõ từng chữ. Khi tâm lơ đãng, hãy đưa sự chú ý trở lại câu niệm một cách nhẹ nhàng, không trách mình. Có thể dùng tràng hạt để đếm; trong Chùa Liên Hoa, bạn có thể làm việc này ngay với tính năng [niệm Phật online](niem-phat-online) và [gõ mõ](go-mo-online) giữ nhịp.',
          'Kết thúc, hãy dành một phút lặng yên cảm nhận sự thay đổi trong thân tâm, rồi hồi hướng bằng [Kệ hồi hướng](kinh/ke-hoi-huong). Bạn không cần chờ thấy điều gì đặc biệt; sự bình tĩnh dần dần đến là đủ.',
        ],
      },
      {
        h2: 'Giữ thói quen lâu dài',
        p: [
          'Hãy bắt đầu ở mức dễ nhất, như năm phút mỗi sáng, rồi tăng dần. Gắn niệm Phật với một thói quen cố định, như sau khi đánh răng hoặc trước khi ngủ. Nếu ngày nào quên, cứ bắt đầu lại, đừng thấy mình thất bại. Có thể kết hợp với việc [ngồi thiền](thien-online) để thêm phần tĩnh lặng. Cuối cùng, hãy nhớ niệm Phật không chỉ để cầu cho mình mà còn để nuôi dưỡng lòng từ bi với mọi người.',
        ],
      },
    ],
    faq: [
      {
        q: 'Niệm Phật có cần theo thầy truyền thọ không?',
        a: 'Người mới có thể tự niệm với tâm thành. Nếu muốn đi sâu và đúng pháp, nên học hỏi với quý thầy cô ở chùa.',
      },
      {
        q: 'Tôi hay quên hoặc lơ đãng khi niệm thì sao?',
        a: 'Điều đó rất bình thường. Chỉ cần nhận ra và nhẹ nhàng quay lại câu niệm, đó chính là sự luyện tập.',
      },
      {
        q: 'Đi đường niệm Phật được không?',
        a: 'Được, nhưng nên niệm thầm và giữ sự chú ý đến an toàn giao thông.',
      },
    ],
    related: ['niem-phat-online', 'go-mo-online', 'thien-online', 'cach-le-phat-tai-nha', 'kinh/niem-phat', 'y-nghia-tung-kinh'],
  },
  // ───────────────────────────── y-nghia-tung-kinh
  {
    slug: 'y-nghia-tung-kinh',
    title: 'Ý nghĩa từng bài kinh thường tụng – Tâm Kinh, A Di Đà, Vu Lan',
    description:
      'Tìm hiểu ý nghĩa ngắn gọn của các bài kinh, chú, kệ thường tụng như Tam Tự Quy, Tâm Kinh, A Di Đà, Phổ Môn, Vu Lan, Đại Bi, Kệ hồi hướng để tụng có hiểu biết.',
    h1: 'Ý nghĩa các bài kinh thường tụng hằng ngày',
    sections: [
      {
        h2: 'Tụng kinh để làm gì?',
        p: [
          'Tụng kinh không chỉ là đọc thành tiếng. Mục đích là để nhắc mình về lời Phật dạy, giúp tâm lắng xuống và nuôi dưỡng lòng từ bi, trí tuệ. Hiểu được ý nghĩa bài kinh sẽ khiến việc tụng sâu sắc hơn nhiều so với đọc theo thói quen. Bạn có thể xem toàn bộ các bài trong [mục lục kinh](kinh) và tụng cùng [nhịp mõ](go-mo-online). Lưu ý rằng nội dung dưới đây chỉ là phần giới thiệu ngắn, để tìm hiểu kỹ hơn nên học với quý thầy cô.',
        ],
      },
      {
        h2: 'Nhóm thời khóa',
        p: ['Đây là những bài thường dùng mở đầu và kết thúc một thời công phu:'],
        list: [
          '[Kệ khai kinh](kinh/ke-khai-kinh): lời tán thán, phát nguyện hiểu thấu nghĩa kinh trước khi tụng.',
          '[Tam Tự Quy](kinh/tam-tu-quy): quay về nương tựa Phật, Pháp, Tăng; là nền tảng của người học Phật.',
          '[Kệ sám hối](kinh/ke-sam-hoi): nhìn lại lỗi lầm do tham, sân, si và phát nguyện không tái phạm.',
          '[Tâm Kinh Bát Nhã](kinh/bat-nha-tam-kinh): bài kinh ngắn nói về tính không, giúp buông bớt chấp trước.',
          '[Kinh A Di Đà](kinh/kinh-a-di-da): giới thiệu cõi Cực Lạc và pháp niệm Phật cầu vãng sinh.',
          '[Phẩm Phổ Môn](kinh/pham-pho-mon): ca ngợi lòng từ bi cứu khổ của Bồ Tát Quán Thế Âm.',
        ],
      },
      {
        h2: 'Kinh về hiếu hạnh và giác ngộ',
        p: [
          '[Kinh Vu Lan](kinh/kinh-vu-lan) kể về lòng hiếu thảo của tôn giả Mục Kiền Liên và là bài thường được đọc vào mùa báo hiếu; xem thêm bài [lễ Vu Lan](le-vu-lan). [Kinh Bát Đại Nhân Giác](kinh/kinh-bat-dai-nhan-giac) nêu tám điều giác ngộ của bậc đại nhân, như ít muốn biết đủ, siêng năng tinh tấn, sống đơn giản và lòng từ rộng lớn.',
        ],
      },
      {
        h2: 'Chú, kệ và hồi hướng',
        p: [
          '[Chú Đại Bi](kinh/chu-dai-bi) gắn với Bồ Tát Quán Thế Âm; [Vãng Sanh Thần Chú](kinh/vang-sanh-than-chu) thường tụng với tâm nguyện cầu cho người đã khuất được an lành. [Tứ Hoằng Thệ Nguyện](kinh/tu-hoang-the-nguyen) là bốn lời nguyện lớn: độ chúng sinh, đoạn phiền não, học pháp môn và thành Phật đạo. Cuối thời công phu, [Kệ hồi hướng](kinh/ke-hoi-huong) giúp ta chia sẻ công đức với tất cả.',
          'Các bài niệm như [niệm Phật](kinh/niem-phat) hay [niệm Địa Tạng Vương Bồ Tát](kinh/niem-dia-tang-vuong-bo-tat) rất phù hợp cho người mới. Kinh văn trong ứng dụng được tổng hợp từ bản tụng phổ biến, chưa qua quý thầy duyệt chính thức; nếu cần, hãy đối chiếu với kinh sách ấn hành.',
        ],
      },
    ],
    faq: [
      {
        q: 'Tôi chưa hiểu nghĩa thì có nên tụng không?',
        a: 'Có thể tụng, nhưng nên tìm hiểu ý nghĩa song song. Hiểu nghĩa giúp việc tụng có chiều sâu hơn.',
      },
      {
        q: 'Bài kinh nào dễ nhất cho người mới?',
        a: 'Tam Tự Quy, Niệm Phật và Kệ hồi hướng đều ngắn và dễ nhớ.',
      },
      {
        q: 'Tụng bằng tiếng Việt hay Hán Việt?',
        a: 'Nhiều chùa tụng bản Hán Việt, nhiều nơi dùng bản dịch tiếng Việt. Bạn hãy chọn bản mình hiểu và thấy phù hợp.',
      },
    ],
    related: ['kinh', 'go-mo-online', 'niem-phat-online', 'cach-niem-phat', 'phap-thoai', 'le-vu-lan'],
  },
  // ───────────────────────────── thien-cho-nguoi-moi
  {
    slug: 'thien-cho-nguoi-moi',
    title: 'Thiền cho người mới bắt đầu: hướng dẫn 5 phút mỗi ngày',
    description:
      'Hướng dẫn thiền cho người mới bắt đầu: bài tập 5 phút theo dõi hơi thở, cách xử lý buồn ngủ, bồn chồn, suy nghĩ miên man và xây dựng thói quen thiền mỗi ngày.',
    h1: 'Thiền cho người mới: bắt đầu từ năm phút',
    sections: [
      {
        h2: 'Đừng đặt kỳ vọng quá cao',
        p: [
          'Nhiều người nghĩ thiền là phải xóa sạch suy nghĩ, nên thử vài lần rồi bỏ cuộc vì thấy đầu óc quá ồn ào. Thực ra, thiền không đòi hỏi đầu óc trống rỗng. Nó chỉ là tập nhận ra tâm mình đang ở đâu, rồi nhẹ nhàng đưa nó trở về. Mỗi lần nhận ra mình đã lang thang và quay lại, đó là một lần tập thành công. Vì vậy, hãy khởi đầu thật khiêm tốn: năm phút mỗi ngày là đủ.',
        ],
      },
      {
        h2: 'Bài tập năm phút',
        p: ['Bạn có thể dùng đồng hồ hẹn giờ trong tính năng [thiền online](thien-online) và làm theo các bước sau:'],
        list: [
          'Ngồi thoải mái, lưng thẳng nhẹ, hai tay đặt trên đùi.',
          'Nhắm mắt hoặc nhìn xuống, hít vào ba hơi dài để thả lỏng thân.',
          'Để hơi thở tự nhiên, đặt sự chú ý nơi mũi hoặc bụng.',
          'Đếm thầm từ một đến mười ở mỗi hơi thở ra, rồi bắt đầu lại.',
          'Khi tâm đi lạc, nhận biết “à, mình nghĩ ngợi”, rồi quay lại hơi thở.',
          'Khi chuông reo, chuyển động nhẹ ngón tay, mở mắt chậm rãi và mỉm cười.',
        ],
      },
      {
        h2: 'Xử lý những khó khăn thường gặp',
        p: [
          'Nếu bạn buồn ngủ, hãy mở mắt hờ, ngồi thẳng hơn hoặc chọn giờ tỉnh táo hơn. Nếu bồn chồn, hãy cảm nhận cảm giác ấy trong thân thay vì cố ép mình yên. Nếu suy nghĩ cứ kéo đến, đừng đánh nhau với chúng; hãy xem như mây trôi qua bầu trời, còn mình là bầu trời. Nếu đau chân, hãy đổi tư thế nhẹ nhàng, hoặc ngồi ghế. Thiền không phải cuộc thi chịu đựng.',
          'Khi quen, bạn có thể dùng câu niệm thay cho hơi thở, như [niệm Phật](cach-niem-phat) trong tâm. Bạn cũng có thể thử [thiền ngoài trời](ngoi-thien-ngoai-troi) hoặc thiền sau khi tụng một bài [kinh ngắn](kinh).',
        ],
      },
      {
        h2: 'Xây dựng thói quen',
        p: [
          'Chọn một giờ cố định, ví dụ ngay sau khi thức dậy. Đặt chỗ ngồi sẵn, tắt thông báo. Dùng chuỗi ngày “giữ lửa” trong Chùa Liên Hoa như một lời nhắc nhẹ nhàng, nhưng đừng để nó thành áp lực. Nếu bỏ lỡ một hôm, hãy bắt đầu lại hôm sau. Nếu muốn học sâu hơn, bạn nên tìm một khóa thiền hoặc một người thầy; ứng dụng này là phần mềm độc lập, chỉ giúp bạn tập đều đặn. Mời xem thêm [hỏi đáp](hoi-dap) để biết cách dùng các tính năng.',
        ],
      },
    ],
    faq: [
      {
        q: 'Tôi không thể ngừng suy nghĩ khi thiền, có sao không?',
        a: 'Không sao. Thiền không phải là không nghĩ, mà là nhận ra mình đang nghĩ và nhẹ nhàng quay lại hơi thở.',
      },
      {
        q: 'Nên thiền bao lâu mỗi lần?',
        a: 'Người mới nên bắt đầu từ 5 phút, sau đó tăng dần lên 10 đến 20 phút khi thấy thoải mái.',
      },
      {
        q: 'Thiền có cần ngồi kiết già không?',
        a: 'Không cần. Bạn có thể ngồi ghế hoặc trên gối, miễn là lưng thẳng nhẹ và thoải mái.',
      },
    ],
    related: ['thien-online', 'ngoi-thien-ngoai-troi', 'cach-niem-phat', 'niem-phat-online', 'phap-thoai'],
  },
  // ───────────────────────────── le-vu-lan
  {
    slug: 'le-vu-lan',
    title: 'Lễ Vu Lan rằm tháng 7: ý nghĩa báo hiếu và cách đón lễ',
    description:
      'Tìm hiểu ý nghĩa lễ Vu Lan rằm tháng 7 âm lịch, tích Mục Kiền Liên, truyền thống báo hiếu cha mẹ, cài hoa hồng và gợi ý cách đón Vu Lan ý nghĩa cho gia đình.',
    h1: 'Lễ Vu Lan: mùa báo hiếu và tri ân',
    sections: [
      {
        h2: 'Vu Lan là ngày nào, nghĩa là gì?',
        p: [
          'Lễ Vu Lan được tổ chức vào ngày rằm tháng 7 âm lịch. Tên gọi xuất phát từ chữ Phạn “Ullambana”, thường được hiểu là sự cứu giúp những nỗi khổ, như nỗi khổ của người bị treo ngược. Ở Việt Nam, Vu Lan đã trở thành mùa báo hiếu, khi con cháu nhớ ơn cha mẹ, ông bà, và hướng tâm về những người đã khuất. Bạn có thể xem [lịch âm](lich-am) để biết ngày dương tương ứng mỗi năm.',
        ],
      },
      {
        h2: 'Tích Mục Kiền Liên',
        p: [
          'Theo [Kinh Vu Lan](kinh/kinh-vu-lan), tôn giả Mục Kiền Liên, một đệ tử của Đức Phật nổi tiếng về thần thông, thương nhớ mẹ đã mất và dùng đạo nhãn tìm thấy mẹ chịu khổ. Ông cầu xin Đức Phật chỉ cách cứu giúp. Đức Phật dạy rằng sức một người không đủ, mà cần nhờ sức chú nguyện của chúng tăng vào ngày rằm tháng 7, sau ba tháng an cư kiết hạ. Câu chuyện nhắc chúng ta rằng lòng hiếu thảo gắn liền với việc làm lành, và công đức có thể được hồi hướng cho người thân.',
        ],
      },
      {
        h2: 'Cài hoa hồng và những việc làm trong mùa Vu Lan',
        p: [
          'Ở Việt Nam, nhiều chùa có nghi thức cài hoa hồng lên áo: người còn mẹ cài hoa hồng đỏ, người mất mẹ cài hoa hồng trắng. Đó là một nét văn hóa gần gũi, nhắc mọi người biết trân quý những người thân còn bên mình. Bên cạnh đó, mùa Vu Lan còn có lễ cúng dường chư tăng, phóng sinh có hiểu biết, ăn chay và làm từ thiện.',
        ],
        list: [
          'Gọi điện, về thăm hoặc dành thời gian ăn cơm cùng cha mẹ.',
          'Viết một lá thư cảm ơn, nói những điều lâu nay chưa kịp nói.',
          'Tụng [Kinh Vu Lan](kinh/kinh-vu-lan) hoặc nghe một buổi [pháp thoại](phap-thoai) về hiếu hạnh.',
          '[Thả đèn hoa đăng](tha-den-hoa-dang) theo cách thân thiện với môi trường.',
          'Giúp đỡ người khó khăn, nhân danh lòng biết ơn.',
        ],
      },
      {
        h2: 'Đón Vu Lan khi ở xa nhà',
        p: [
          'Nếu bạn đang ở xa, hãy nhắn một lời hỏi thăm, thắp một nén hương trong lòng, [niệm Phật](niem-phat-online) hoặc ghé sân chùa trong Chùa Liên Hoa để thả một chiếc đèn gửi lời nguyện lành. Ứng dụng là phần mềm độc lập, không phải chùa thật, nhưng hy vọng giúp bạn nhớ nghĩ đến cha mẹ. Khi có dịp, hãy về chùa dự lễ cùng đại chúng. Xem thêm [ngày lễ Phật giáo](ngay-le-phat-giao) để biết các dịp lễ khác trong năm.',
        ],
      },
    ],
    faq: [
      {
        q: 'Lễ Vu Lan có phải là ngày xá tội vong nhân không?',
        a: 'Trong dân gian, rằm tháng 7 còn được gọi là ngày xá tội vong nhân. Với người học Phật, ý nghĩa chính của Vu Lan là báo hiếu và làm việc thiện hồi hướng cho người thân.',
      },
      {
        q: 'Cài hoa hồng ngày Vu Lan nghĩa là gì?',
        a: 'Hoa hồng đỏ cho người còn mẹ, hoa hồng trắng cho người đã mất mẹ, nhắc nhớ trân quý và tri ân.',
      },
      {
        q: 'Không đến chùa được thì đón Vu Lan thế nào?',
        a: 'Bạn có thể về thăm cha mẹ, tụng kinh tại nhà, làm việc thiện và hồi hướng công đức cho người thân.',
      },
    ],
    related: ['kinh/kinh-vu-lan', 'tha-den-hoa-dang', 'ngay-le-phat-giao', 'lich-am', 'phap-thoai', 'y-nghia-tung-kinh'],
  },
  // ───────────────────────────── phat-dan
  {
    slug: 'phat-dan',
    title: 'Lễ Phật Đản 15/4 âm lịch: ý nghĩa và cách đón Phật Đản',
    description:
      'Tìm hiểu ý nghĩa lễ Phật Đản rằm tháng 4 âm lịch, ngày đản sinh Thái tử Tất Đạt Đa, tục tắm Phật, thả đèn hoa đăng và gợi ý cách đón Phật Đản trang nghiêm.',
    h1: 'Lễ Phật Đản: mừng ngày Đức Phật ra đời',
    sections: [
      {
        h2: 'Phật Đản là gì?',
        p: [
          'Phật Đản là lễ kỷ niệm ngày đản sinh của Thái tử Tất Đạt Đa, người sau này trở thành Đức Phật Thích Ca Mâu Ni. Theo truyền thống Phật giáo Việt Nam, lễ được tổ chức vào ngày rằm tháng 4 âm lịch. Quốc tế gọi là Vesak, và Liên Hợp Quốc từng công nhận Vesak là một ngày lễ quốc tế từ năm 1999. Để biết ngày dương tương ứng mỗi năm, bạn có thể xem [lịch âm](lich-am).',
          'Theo truyền thống, Thái tử đản sinh tại vườn Lâm Tỳ Ni, nay thuộc Nepal. Phật Đản không chỉ là sinh nhật của một con người đặc biệt mà còn là dịp nhớ lại thông điệp từ bi và trí tuệ mà Ngài truyền dạy suốt đời.',
        ],
      },
      {
        h2: 'Những nghi thức truyền thống',
        p: ['Mỗi chùa có thể tổ chức hơi khác nhau, nhưng thường có các hoạt động sau:'],
        list: [
          'Lễ tắm Phật: dùng nước thơm tưới lên tượng Thái tử, ý nghĩa là gội rửa phiền não, giữ thân tâm thanh sạch.',
          'Tụng kinh và nghe pháp về cuộc đời Đức Phật.',
          'Rước kiệu, treo cờ Phật giáo, trang trí đèn hoa sen.',
          '[Thả đèn hoa đăng](tha-den-hoa-dang) trong tinh thần cầu bình an, giữ gìn môi trường.',
          'Làm việc thiện, cúng dường, phát quà cho người khó khăn.',
        ],
      },
      {
        h2: 'Ý nghĩa với người học Phật hôm nay',
        p: [
          'Điều quý nhất ở Phật Đản không nằm ở khung cảnh lộng lẫy, mà ở việc mỗi người nhìn lại mình: mình đã sống từ bi hơn, tỉnh thức hơn chưa? Bạn có thể đọc lại bài [Kinh A Di Đà](kinh/kinh-a-di-da), thiền một lát dưới bóng cây, hoặc tìm hiểu về [cây bồ đề](cay-bo-de), nơi Đức Phật thành đạo. Một việc tốt nhỏ, như giúp đỡ người lạ hay tha thứ cho một người, cũng là cách chào mừng Phật Đản đẹp.',
        ],
      },
      {
        h2: 'Cách đón Phật Đản khi ở xa chùa',
        p: [
          'Nếu không thể đến chùa, bạn có thể [thắp hương](thap-huong-online), [niệm Phật](niem-phat-online) hoặc ngồi [thiền](thien-online) tại nhà. Chùa Liên Hoa là phần mềm độc lập, không phải chùa thật, nhưng bạn có thể dùng sân chùa online để có một phút dừng lại giữa ngày bận rộn. Khi có điều kiện, hãy đến chùa gần nhà để dự lễ cùng đại chúng. Xem thêm bài tổng hợp [ngày lễ Phật giáo](ngay-le-phat-giao).',
        ],
      },
    ],
    faq: [
      {
        q: 'Phật Đản là ngày nào?',
        a: 'Ngày rằm tháng 4 âm lịch (15/4) theo truyền thống Phật giáo Việt Nam.',
      },
      {
        q: 'Tắm Phật có ý nghĩa gì?',
        a: 'Tắm Phật là biểu tượng của việc gội rửa phiền não nơi chính mình, giữ tâm trong sạch, chứ không phải rửa cho tượng.',
      },
      {
        q: 'Vesak là gì?',
        a: 'Vesak là cách gọi quốc tế của ngày lễ kỷ niệm Đức Phật đản sinh, thành đạo và nhập diệt ở nhiều quốc gia.',
      },
    ],
    related: ['ngay-le-phat-giao', 'tha-den-hoa-dang', 'cay-bo-de', 'lich-am', 'thien-online', 'le-vu-lan'],
  },
  // ───────────────────────────── tha-den-hoa-dang
  {
    slug: 'tha-den-hoa-dang',
    title: 'Thả đèn hoa đăng online – gửi lời nguyện lành bằng đèn sen',
    description:
      'Thả đèn hoa đăng online trên Chùa Liên Hoa: chọn màu đèn, ghi một chữ nguyện, ý nghĩa tục thả đèn dịp rằm, Vu Lan, Phật Đản và cách thả đèn thật giữ môi trường.',
    h1: 'Thả đèn hoa đăng online: một ngọn đèn, một lời nguyện',
    sections: [
      {
        h2: 'Ý nghĩa của đèn hoa đăng',
        p: [
          'Hoa đăng nghĩa là đèn hoa. Từ lâu, trong các dịp lễ như rằm, [Vu Lan](le-vu-lan) hay [Phật Đản](phat-dan), người ta thả những chiếc đèn hình hoa sen lên mặt nước hoặc treo thành hàng ở sân chùa. Ánh sáng trong đạo Phật thường là hình ảnh của trí tuệ, soi tan bóng tối vô minh. Một ngọn đèn nhỏ cũng đủ nhắc ta rằng mỗi người đều có thể thắp lên ánh sáng của lòng tốt, dù hoàn cảnh còn nhiều khó khăn.',
        ],
      },
      {
        h2: 'Thả đèn trong Chùa Liên Hoa',
        p: [
          'Trong ứng dụng, bạn có thể chọn một chiếc đèn sen với một trong sáu màu: vàng, hồng sen, trắng, đỏ, xanh ngọc hoặc tím. Mỗi màu gợi một ý nghĩa nhẹ nhàng, ví dụ trắng gợi sự thanh tịnh, vàng gợi sự ấm áp và trí tuệ. Sau đó, bạn chọn một chữ nguyện, như bình an, biết ơn hay từ bi, rồi thả đèn lên mặt hồ trong sân chùa. Chiếc đèn sẽ trôi chậm rãi cùng những chiếc đèn khác.',
        ],
        list: [
          'Chọn một màu đèn mà bạn thấy gần gũi.',
          'Chọn một chữ nguyện, hoặc nghĩ trong lòng một lời nguyện của riêng mình.',
          'Thả đèn rồi chắp tay, hít thở ba hơi thật chậm.',
          'Kết thúc bằng một câu [niệm Phật](niem-phat-online) hoặc [hồi hướng](kinh/ke-hoi-huong).',
        ],
      },
      {
        h2: 'Một lời nguyện đẹp là gì?',
        p: [
          'Lời nguyện đẹp thường hướng ra ngoài chính mình: mong cha mẹ khỏe mạnh, mong người đang khổ được nhẹ lòng, mong mình đủ kiên nhẫn để sống tử tế hơn. Nếu bạn nguyện cho bản thân, hãy nguyện những điều thuộc về mình có thể thực hành, như siêng năng hơn hay bớt nóng giận. Cách nghĩ này gần với tinh thần của [Tứ Hoằng Thệ Nguyện](kinh/tu-hoang-the-nguyen), nơi lời nguyện được gắn với hành động.',
        ],
      },
      {
        h2: 'Thả đèn thật: nhớ giữ gìn môi trường',
        p: [
          'Nếu bạn tham gia thả đèn ở ngoài đời, hãy chọn loại đèn làm từ vật liệu tự phân hủy như giấy, lá chuối, và không dùng đèn kèm nhựa, xốp hay pin. Vớt đèn sau lễ để tránh gây ô nhiễm sông hồ, và tuân theo hướng dẫn của ban tổ chức hoặc chính quyền địa phương. Việc giữ sông nước trong sạch cũng là một cách thực hành lòng từ bi. Ứng dụng này là phần mềm độc lập, không phải chùa thật, nên thả đèn trong ứng dụng không tạo ra rác nào cả, nhưng đừng quên tấm lòng ngoài đời. Xem thêm [ngày lễ Phật giáo](ngay-le-phat-giao).',
        ],
      },
    ],
    faq: [
      {
        q: 'Thả đèn hoa đăng online có ý nghĩa không?',
        a: 'Ý nghĩa nằm ở lời nguyện và sự lắng lòng của bạn. Đây là mô phỏng nhẹ nhàng, không hứa hẹn kết quả nào.',
      },
      {
        q: 'Màu đèn nào tốt nhất?',
        a: 'Không có màu nào tốt hơn. Mỗi màu chỉ gợi một ý nghĩa nhẹ nhàng, bạn chọn màu mình thấy gần gũi.',
      },
      {
        q: 'Khi thả đèn thật cần lưu ý gì?',
        a: 'Dùng đèn tự phân hủy, vớt đèn sau lễ, không xả rác và theo hướng dẫn của địa phương.',
      },
    ],
    related: ['le-vu-lan', 'phat-dan', 'ngay-le-phat-giao', 'niem-phat-online', 'huong-dan-di-chua-online'],
  },
  // ───────────────────────────── cay-bo-de
  {
    slug: 'cay-bo-de',
    title: 'Cây bồ đề trong Phật giáo – nơi Đức Phật thành đạo',
    description:
      'Tìm hiểu ý nghĩa cây bồ đề trong Phật giáo: cội cây nơi Đức Phật thành đạo ở Bồ Đề Đạo Tràng, biểu tượng của giác ngộ và vì sao nhiều chùa trồng bồ đề.',
    h1: 'Cây bồ đề: cội cây của sự tỉnh thức',
    sections: [
      {
        h2: 'Cây bồ đề là cây gì?',
        p: [
          'Cây bồ đề, tên khoa học là Ficus religiosa, là loài cây thuộc họ sung, có lá hình tim với đầu lá thon dài. Trong tiếng Phạn, “bodhi” nghĩa là giác ngộ, nên cây được gọi là cội bồ đề, tức cây giác ngộ. Cây có thể sống rất lâu và tỏa bóng mát rộng, rất hợp để trồng ở sân đình, sân chùa. Dù ở nhiều nơi, người ta hay gọi các loài cây khác là bồ đề, nhưng cây gắn với truyền thống Phật giáo chính là loài đã nêu ở đây.',
        ],
      },
      {
        h2: 'Nơi Đức Phật thành đạo',
        p: [
          'Theo truyền thống, Thái tử Tất Đạt Đa sau nhiều năm tìm đạo đã ngồi thiền dưới một cội cây ở Bodh Gaya, nay thuộc bang Bihar, Ấn Độ, và giác ngộ vào đêm cuối. Từ đó nơi này được gọi là Bồ Đề Đạo Tràng, một trong những thánh địa quan trọng nhất của Phật giáo. Cây bồ đề hiện nay ở đó được xem là hậu duệ của cội cây ban đầu. Ngày Đức Phật thành đạo được nhớ vào ngày 8 tháng 12 âm lịch; bạn có thể xem thêm ở bài [ngày lễ Phật giáo](ngay-le-phat-giao).',
        ],
      },
      {
        h2: 'Biểu tượng và bài học',
        p: ['Cây bồ đề gợi nhiều điều đáng suy ngẫm cho người thực hành hôm nay:'],
        list: [
          'Cội rễ vững: nền tảng của giới đức và sự kiên trì.',
          'Bóng mát rộng: lòng từ che chở mọi người, không phân biệt.',
          'Lá hình tim: nhắc rằng giác ngộ gắn liền với trái tim biết thương yêu.',
          'Ngồi dưới gốc cây: ngay giữa thiên nhiên, tâm có thể yên lắng, xem thêm bài [ngồi thiền ngoài trời](ngoi-thien-ngoai-troi).',
        ],
      },
      {
        h2: 'Cây bồ đề trong sân chùa và trong ứng dụng',
        p: [
          'Nhiều chùa ở Việt Nam trồng cây bồ đề trong khuôn viên, và vào dịp [Phật Đản](phat-dan) hoặc [rằm tháng Giêng](ngay-ram-mung-mot), người ta thường đến ngồi dưới gốc cây để thiền hoặc lặng lẽ cầu nguyện. Trong sân chùa của Chùa Liên Hoa, bạn có thể đến gần một cội bồ đề, ngồi lặng và thực hành [thiền online](thien-online). Cây chỉ là phương tiện nhắc nhớ; sự giác ngộ nằm ở việc rèn luyện tâm mỗi ngày. Chùa Liên Hoa là phần mềm độc lập, không phải chùa thật.',
        ],
      },
    ],
    faq: [
      {
        q: 'Cây bồ đề có phải cây Đức Phật ngồi thiền thật không?',
        a: 'Theo truyền thống, Đức Phật thành đạo dưới một cội bồ đề ở Bodh Gaya. Cây ngày nay ở đó được xem là hậu duệ của cội cây ấy.',
      },
      {
        q: 'Bồ đề có nghĩa là gì?',
        a: 'Bồ đề là phiên âm của từ “bodhi”, nghĩa là sự giác ngộ, tỉnh thức.',
      },
      {
        q: 'Trồng bồ đề trong sân nhà có được không?',
        a: 'Được, nhưng cây lớn nhanh và rễ khỏe, nên cần chọn nơi đủ rộng, tránh sát nhà hoặc đường ống.',
      },
    ],
    related: ['phat-dan', 'ngay-le-phat-giao', 'thien-online', 'ngoi-thien-ngoai-troi', 'thien-cho-nguoi-moi'],
  },
  // ───────────────────────────── quan-the-am-bo-tat
  {
    slug: 'quan-the-am-bo-tat',
    title: 'Quán Thế Âm Bồ Tát: ý nghĩa, ngày vía và cách niệm danh hiệu',
    description:
      'Tìm hiểu Quán Thế Âm Bồ Tát, vị Bồ Tát của lòng từ bi: ý nghĩa tên gọi, các ngày vía 19/2, 19/6, 19/9, Phẩm Phổ Môn, Chú Đại Bi và cách niệm danh hiệu.',
    h1: 'Quán Thế Âm Bồ Tát: hình ảnh của lòng từ bi lắng nghe',
    sections: [
      {
        h2: 'Tên gọi và ý nghĩa',
        p: [
          'Quán Thế Âm nghĩa là quán sát âm thanh của thế gian, tức là lắng nghe tiếng kêu than của chúng sinh để cứu giúp. Người ta còn gọi Ngài là Quan Âm, hay Quán Tự Tại, tên xuất hiện ở đầu [Tâm Kinh Bát Nhã](kinh/bat-nha-tam-kinh). Trong văn hóa Phật giáo Việt Nam, Quán Thế Âm là hình ảnh tiêu biểu của lòng đại bi, nên nhiều gia đình thờ tượng Ngài như một người mẹ hiền, nhắc ta sống dịu dàng và biết lắng nghe.',
        ],
      },
      {
        h2: 'Các ngày vía',
        p: [
          'Truyền thống thường nhớ ba ngày vía của Bồ Tát Quán Thế Âm theo âm lịch: ngày 19 tháng 2 (đản sinh), 19 tháng 6 (thành đạo) và 19 tháng 9 (xuất gia). Vào những ngày này, nhiều chùa tổ chức tụng kinh, nhất là [Phẩm Phổ Môn](kinh/pham-pho-mon) và [Chú Đại Bi](kinh/chu-dai-bi). Để biết ngày dương tương ứng, bạn hãy xem [lịch âm](lich-am); bài [ngày lễ Phật giáo](ngay-le-phat-giao) cũng có danh sách các ngày liên quan.',
        ],
      },
      {
        h2: 'Kinh và chú liên quan',
        p: ['Một số bài thường được tụng khi hướng tâm về Bồ Tát Quán Thế Âm:'],
        list: [
          '[Phẩm Phổ Môn](kinh/pham-pho-mon) trong Kinh Pháp Hoa: ca ngợi hạnh nguyện cứu khổ.',
          '[Chú Đại Bi](kinh/chu-dai-bi): bài chú gắn với Bồ Tát Quán Thế Âm, được nhiều người tụng hằng ngày.',
          '[Tâm Kinh Bát Nhã](kinh/bat-nha-tam-kinh): mở đầu bằng tên Bồ Tát Quán Tự Tại.',
          'Câu niệm “Nam mô Quán Thế Âm Bồ Tát” khi tâm lo lắng, cần nương tựa.',
        ],
      },
      {
        h2: 'Cách niệm danh hiệu và học theo hạnh Bồ Tát',
        p: [
          'Bạn có thể niệm danh hiệu Quán Thế Âm bằng tràng hạt, giống cách [niệm Phật](cach-niem-phat). Hãy niệm thong thả, thấy câu niệm như một lời nhắc: hôm nay mình đã lắng nghe ai chưa? Đã nói điều gì làm dịu lòng người khác chưa? Cách học theo Bồ Tát không phải chờ phép màu, mà là thực hành sự lắng nghe, kiên nhẫn và giúp đỡ trong khả năng của mình.',
          'Trong Chùa Liên Hoa, bạn có thể [thắp hương](thap-huong-online), niệm danh hiệu và dùng [mõ](go-mo-online) giữ nhịp. Ứng dụng là phần mềm độc lập, không phải chùa thật; để học sâu về Bồ Tát, nên tìm hiểu cùng quý thầy cô ở chùa.',
        ],
      },
    ],
    faq: [
      {
        q: 'Vía Quan Âm là những ngày nào?',
        a: 'Thường nhớ vào các ngày 19/2, 19/6 và 19/9 âm lịch.',
      },
      {
        q: 'Quan Âm và Quán Thế Âm có phải là một?',
        a: 'Đúng, Quan Âm là cách gọi rút gọn của Quán Thế Âm; ngoài ra còn tên Quán Tự Tại.',
      },
      {
        q: 'Nên tụng bài nào để hướng về Bồ Tát Quán Thế Âm?',
        a: 'Phẩm Phổ Môn và Chú Đại Bi là hai bài phổ biến; người mới có thể bắt đầu bằng niệm danh hiệu.',
      },
    ],
    related: ['kinh/pham-pho-mon', 'kinh/chu-dai-bi', 'ngay-le-phat-giao', 'cach-niem-phat', 'lich-am', 'niem-phat-online'],
  },
  // ───────────────────────────── di-chua-ram-mung-mot
  {
    slug: 'di-chua-ram-mung-mot',
    title: 'Đi chùa ngày rằm, mùng một: chuẩn bị và lưu ý khi đến chùa',
    description:
      'Kinh nghiệm đi chùa ngày rằm và mùng một: trang phục, lễ vật giản dị, cách ứng xử trong chùa, trình tự lễ Phật và những điều cần lưu ý để buổi đi chùa trọn vẹn.',
    h1: 'Đi chùa ngày rằm, mùng một: chuẩn bị gì và nên lưu ý gì?',
    sections: [
      {
        h2: 'Trước khi đi chùa',
        p: [
          'Ngày mùng một và rằm là hai ngày nhiều người đến chùa nhất, nên nếu có thể hãy đi sớm để chùa còn yên tĩnh. Bạn nên xem [lịch âm](lich-am) để chắc chắn ngày, và tìm hiểu giờ tụng kinh, giờ mở cửa của chùa. Hãy chọn trang phục kín đáo, lịch sự, màu nhã nhặn; tránh quần áo quá ngắn, quá sát hoặc hở hang. Giữ tâm thoải mái, không vội vàng; đi chùa là để lắng lòng, không phải để chạy theo thủ tục.',
          'Về lễ vật, bạn chỉ cần hoa, trái cây hoặc nến hương đơn giản. Nhiều chùa không khuyến khích đốt vàng mã và đốt quá nhiều hương, vì vừa lãng phí vừa ảnh hưởng không khí, nên hãy làm theo hướng dẫn tại chùa.',
        ],
      },
      {
        h2: 'Cách ứng xử khi ở trong chùa',
        p: ['Một số điều đơn giản giúp buổi đi chùa trọn vẹn:'],
        list: [
          'Chào hỏi quý thầy cô bằng cách chắp tay, nói “A Di Đà Phật”.',
          'Đi nhẹ, nói khẽ, tắt chuông điện thoại.',
          'Không chụp ảnh nơi có biển cấm; không đứng chắn trước chánh điện.',
          'Thắp hương theo hướng dẫn của chùa, rồi lễ Phật ở chánh điện trước, sau đó mới lễ các điện khác.',
          'Giữ gìn vệ sinh, bỏ rác đúng nơi, không xả rác trong khuôn viên chùa.',
        ],
      },
      {
        h2: 'Sau khi lễ Phật',
        p: [
          'Đừng vội ra về. Hãy ngồi lại một lát trong sân chùa hoặc dưới bóng cây, [niệm Phật](cach-niem-phat) hoặc [ngồi thiền](ngoi-thien-ngoai-troi) vài phút. Nếu chùa có buổi giảng hoặc tụng kinh, hãy tham dự để nghe pháp. Bạn cũng có thể dùng buổi đi chùa để làm việc thiện, giúp đỡ người già, trẻ em hoặc đóng góp theo khả năng. Cúng dường là tự nguyện, không ai bắt buộc.',
        ],
      },
      {
        h2: 'Khi chưa thể đến chùa',
        p: [
          'Nếu bận hoặc ở xa, bạn có thể [lễ Phật tại nhà](cach-le-phat-tai-nha) và ghé sân chùa online trong Chùa Liên Hoa để [thắp hương](thap-huong-online) và niệm Phật. Chùa Liên Hoa là phần mềm độc lập, không phải chùa thật, nên không thể thay thế việc đến chùa; nhưng hy vọng là một cách nhắc bạn nhớ ngày rằm và mùng một. Bài [ngày rằm, mùng một](ngay-ram-mung-mot) có thêm nhiều gợi ý khác.',
        ],
      },
    ],
    faq: [
      {
        q: 'Nên mặc gì khi đi chùa?',
        a: 'Quần áo kín đáo, lịch sự, màu nhã nhặn; tránh đồ quá ngắn, quá sát hoặc hở hang.',
      },
      {
        q: 'Đi chùa có bắt buộc phải mang lễ vật không?',
        a: 'Không. Chỉ cần tâm thành; hoa, quả hoặc hương đơn giản là đủ.',
      },
      {
        q: 'Đi chùa vào giờ nào thì thuận lợi?',
        a: 'Buổi sáng sớm thường yên tĩnh hơn. Bạn nên hỏi giờ mở cửa và giờ tụng kinh của chùa.',
      },
    ],
    related: ['ngay-ram-mung-mot', 'lich-am', 'cach-le-phat-tai-nha', 'thap-huong-online', 'di-chua-dau-nam', 'ngoi-thien-ngoai-troi'],
  },
  // ───────────────────────────── ngoi-thien-ngoai-troi
  {
    slug: 'ngoi-thien-ngoai-troi',
    title: 'Ngồi thiền ngoài trời: chọn nơi, tư thế và cách giữ tâm yên',
    description:
      'Hướng dẫn ngồi thiền ngoài trời: chọn nơi yên tĩnh, tư thế, cảm nhận âm thanh thiên nhiên, lưu ý an toàn và cách kết hợp với thiền online trong Chùa Liên Hoa.',
    h1: 'Ngồi thiền ngoài trời: lắng nghe gió và tiếng chim',
    sections: [
      {
        h2: 'Vì sao thiền ngoài trời?',
        p: [
          'Ngồi thiền ngoài trời giúp ta tiếp xúc trực tiếp với thiên nhiên: làn gió, ánh nắng, tiếng chim, mùi đất ẩm. Những âm thanh và cảm giác ấy là đối tượng rất tự nhiên cho sự chú ý. Nhiều người thấy dễ thư giãn hơn khi ngồi dưới bóng cây thay vì ở trong phòng kín. Dù vậy, ngoài trời cũng có nhiều thứ làm xao lãng, nên cần chuẩn bị một chút.',
        ],
      },
      {
        h2: 'Chọn nơi và chuẩn bị',
        p: ['Một vài gợi ý giúp buổi thiền ngoài trời thuận lợi:'],
        list: [
          'Chọn nơi yên tĩnh, an toàn như công viên, sân vườn, hoặc sân chùa; tránh sát đường lớn.',
          'Chọn bóng râm vào buổi sáng sớm hoặc chiều mát, tránh trời nắng gắt.',
          'Mang theo khăn trải hoặc gối nhỏ, nước uống và bình xịt chống muỗi nếu cần.',
          'Để điện thoại ở chế độ im lặng; dùng đồng hồ hẹn giờ trong tính năng [thiền online](thien-online).',
          'Báo cho người thân biết nếu đi một mình ở nơi vắng.',
        ],
      },
      {
        h2: 'Cách ngồi và lắng nghe',
        p: [
          'Ngồi ở tư thế thoải mái, lưng thẳng nhẹ. Nhắm mắt hoặc để mắt nhìn xuống. Hãy bắt đầu bằng vài hơi thở sâu, rồi chuyển sự chú ý sang âm thanh xung quanh: tiếng chim, tiếng lá xào xạc, tiếng xe xa xa. Không cần gắn tên hay đánh giá, chỉ cần nghe. Khi tâm kéo bạn đi vào suy nghĩ, hãy quay lại hơi thở hoặc âm thanh. Sau vài phút, bạn có thể cảm nhận cơ thể đang ngồi trên mặt đất, gió chạm vào da.',
          'Nếu bạn mới tập, hãy xem bài [thiền cho người mới](thien-cho-nguoi-moi) để biết cách xử lý buồn ngủ hoặc bồn chồn. Ngồi dưới một [cây bồ đề](cay-bo-de), nếu có điều kiện, cũng là một trải nghiệm đẹp.',
        ],
      },
      {
        h2: 'Kết hợp với sân chùa online',
        p: [
          'Khi không thể ra ngoài, bạn có thể bước vào sân chùa trong Chùa Liên Hoa, nghe tiếng chuông, tiếng gió và ngồi thiền với hơi thở. Hãy xem đó như một cách luyện tập trước khi ra ngoài đời. Ứng dụng là phần mềm độc lập, không phải chùa thật. Khi có dịp, hãy thử [đi chùa](di-chua-ram-mung-mot) và ngồi lặng trong khuôn viên, hoặc [niệm Phật](niem-phat-online) khi đi dạo chậm.',
        ],
      },
    ],
    faq: [
      {
        q: 'Thiền ngoài trời có thể bị xao lãng, phải làm sao?',
        a: 'Hãy xem những âm thanh xung quanh là một phần của buổi thiền; không cưỡng lại, chỉ cần nhẹ nhàng quay về hơi thở.',
      },
      {
        q: 'Có nên thiền một mình ở nơi vắng không?',
        a: 'Nên chọn nơi an toàn và báo cho người thân, hoặc đi cùng bạn bè.',
      },
    ],
    related: ['thien-online', 'thien-cho-nguoi-moi', 'cay-bo-de', 'di-chua-ram-mung-mot', 'niem-phat-online'],
  },
  // ───────────────────────────── di-chua-dau-nam
  {
    slug: 'di-chua-dau-nam',
    title: 'Đi chùa đầu năm: ý nghĩa, cách lễ và những điều nên nhớ',
    description:
      'Tìm hiểu tục đi chùa đầu năm của người Việt: ý nghĩa, thời điểm, cách lễ Phật, những điều nên nhớ để giữ chùa trang nghiêm và đón năm mới bình an, tỉnh thức.',
    h1: 'Đi chùa đầu năm: cầu bình an bằng tâm thành',
    sections: [
      {
        h2: 'Vì sao người Việt đi chùa đầu năm?',
        p: [
          'Đi chùa đầu năm là nét văn hóa quen thuộc của người Việt mỗi dịp Tết Nguyên đán và rằm tháng Giêng. Sau những ngày chuẩn bị tất bật, nhiều gia đình đến chùa lễ Phật, dâng hương, mong cho cả nhà bình an, tâm hồn thanh thản, và nhìn lại năm cũ. Với người học Phật, đây không phải dịp để xin xỏ nhiều điều, mà là dịp phát nguyện sống tốt hơn trong năm mới. Bạn có thể xem [lịch âm](lich-am) để biết ngày dương tương ứng với mùng một Tết.',
        ],
      },
      {
        h2: 'Thời điểm và cách lễ',
        p: [
          'Nhiều người đi chùa vào đêm giao thừa hoặc trong những ngày đầu năm, mùng một đến mùng ba, và vào rằm tháng Giêng. Vì chùa thường rất đông, bạn nên đi sớm, kiên nhẫn xếp hàng và nhường nhau. Một trình tự đơn giản có thể là:',
        ],
        list: [
          'Chào quý thầy cô, chắp tay trang nghiêm.',
          'Thắp hương theo hướng dẫn của chùa, lễ Phật ở chánh điện trước.',
          'Giữ yên lặng, [niệm Phật](cach-niem-phat) hoặc nhắc lại lời nguyện cho năm mới.',
          'Tham gia buổi tụng kinh hoặc nghe pháp nếu chùa có tổ chức.',
          'Làm một việc thiện nhỏ: đóng góp tùy tâm, giúp người già hoặc trẻ em trong chùa.',
        ],
      },
      {
        h2: 'Lời nguyện đầu năm',
        p: [
          'Thay vì chỉ mong tài lộc, hãy thử viết ra ba điều bạn muốn thực hành trong năm: nói lời dịu dàng hơn với gia đình, dành mười phút mỗi ngày [ngồi thiền](thien-online) hoặc niệm Phật, giúp ai đó mỗi tuần. Những lời nguyện này thuộc về hành động của bạn, nên có thể thực hiện được. Nếu muốn, hãy tìm hiểu thêm về [ngày lễ Phật giáo](ngay-le-phat-giao) để lên kế hoạch dịp lễ cả năm.',
        ],
      },
      {
        h2: 'Một vài lưu ý để chùa luôn trang nghiêm',
        p: [
          'Tránh chen lấn, đốt quá nhiều hương, đốt vàng mã hoặc thả rác trong khuôn viên chùa. Không nên chạy theo những lời đồn về “giải hạn”, “cúng sao” có thu phí. Giáo lý nhà Phật nhấn mạnh nhân quả và việc làm lành, không phải mua bán phước báu. Khi chưa thể đến chùa, bạn có thể [lễ Phật tại nhà](cach-le-phat-tai-nha) hoặc ghé sân chùa online trong Chùa Liên Hoa, một phần mềm độc lập, không phải chùa thật. Đọc thêm bài [đi chùa ngày rằm, mùng một](di-chua-ram-mung-mot).',
        ],
      },
    ],
    faq: [
      {
        q: 'Đi chùa đầu năm vào lúc nào là tốt nhất?',
        a: 'Không có giờ cố định. Bạn có thể đi trong những ngày đầu năm hoặc rằm tháng Giêng; nên đi sớm để chùa bớt đông.',
      },
      {
        q: 'Có nên đi chùa cúng sao giải hạn không?',
        a: 'Giáo lý Phật giáo nhấn mạnh việc sống tốt và làm lành. Bạn nên thận trọng với những lời hứa hẹn “giải hạn” có thu phí.',
      },
      {
        q: 'Đi chùa đầu năm nên cầu điều gì?',
        a: 'Hãy phát nguyện những điều thuộc về hành động của mình, như sống từ bi, giữ lời, hiếu thảo hơn.',
      },
    ],
    related: ['di-chua-ram-mung-mot', 'ngay-ram-mung-mot', 'lich-am', 'ngay-le-phat-giao', 'cach-le-phat-tai-nha', 'niem-phat-online'],
  },
  // ───────────────────────────── chinh-sach-quyen-rieng-tu
  {
    slug: 'chinh-sach-quyen-rieng-tu',
    title: 'Chính sách quyền riêng tư – Chùa Liên Hoa',
    description:
      'Chính sách quyền riêng tư của Chùa Liên Hoa: dữ liệu lưu trên thiết bị, khi nào dùng email tài khoản, phòng chung, lời nhắc và quyền xóa dữ liệu của bạn.',
    h1: 'Chính sách quyền riêng tư của Chùa Liên Hoa',
    sections: [
      {
        h2: 'Nguyên tắc chung',
        p: [
          'Chùa Liên Hoa là phần mềm độc lập, không phải chùa thật và không thuộc tổ chức tôn giáo nào. Chúng tôi cố gắng thu thập ít dữ liệu nhất có thể, chỉ vừa đủ để ứng dụng hoạt động. Chúng tôi không bán dữ liệu cá nhân của bạn. Trang này giải thích bằng ngôn ngữ đơn giản những gì ứng dụng lưu và vì sao. Nếu bạn không đồng ý, bạn có thể ngừng sử dụng bất cứ lúc nào.',
        ],
      },
      {
        h2: 'Dữ liệu lưu trên thiết bị của bạn',
        p: ['Khi dùng ứng dụng, một số thông tin được lưu ngay trong bộ nhớ trình duyệt của bạn (local storage), gồm:'],
        list: [
          'Hồ sơ nhân vật: tên gọi, dáng vẻ, phụ kiện.',
          'Tiến trình: cấp độ, chuỗi ngày “giữ lửa”, số lần niệm Phật, tụng kinh, thiền.',
          'Cài đặt: âm lượng, chất lượng đồ họa, lời nhắc hằng ngày.',
        ],
      },
      {
        h2: 'Tài khoản tùy chọn và dữ liệu trên máy chủ',
        p: [
          'Bạn có thể dùng ứng dụng mà không cần tài khoản. Nếu muốn đồng bộ tiến trình giữa nhiều thiết bị, bạn có thể tạo tài khoản bằng email. Khi đó, chúng tôi lưu email cùng tiến trình và hồ sơ của bạn trên máy chủ để phục vụ việc đồng bộ. Khi bạn vào phòng chung hoặc phòng riêng, máy chủ tạm xử lý vị trí nhân vật và các câu chào soạn sẵn để người khác nhìn thấy; ứng dụng không có khung chat tự do. Thông tin liên hệ cá nhân không bắt buộc và chúng tôi khuyến khích bạn không đưa vào tên gọi.',
        ],
      },
      {
        h2: 'Quảng cáo, cookie và bên thứ ba',
        p: [
          'Chúng tôi không hiển thị quảng cáo và không bán dữ liệu cho bên quảng cáo. Ứng dụng có thể dùng các thông tin kỹ thuật cơ bản như loại trình duyệt hay lỗi hệ thống để cải thiện chất lượng; các thông tin này không dùng để nhận diện cá nhân bạn. Nếu sau này có thay đổi, chúng tôi sẽ cập nhật trang này.',
        ],
      },
      {
        h2: 'Quyền của bạn',
        p: [
          'Bạn có thể xóa dữ liệu trên thiết bị bằng cách xóa dữ liệu trang web trong trình duyệt. Nếu đã tạo tài khoản và muốn xóa dữ liệu trên máy chủ, hãy liên hệ chúng tôi qua phần góp ý trong ứng dụng. Với trẻ em, chúng tôi khuyến khích có phụ huynh đồng hành khi sử dụng. Bạn có thể xem thêm [điều khoản sử dụng](dieu-khoan-su-dung), [nội quy](noi-quy) và [hỏi đáp](hoi-dap). Nếu có câu hỏi, xin liên hệ qua ứng dụng; trang [giới thiệu](gioi-thieu) cũng cung cấp thông tin chung về dự án.',
        ],
      },
    ],
    faq: [
      {
        q: 'Chùa Liên Hoa có bán dữ liệu cá nhân không?',
        a: 'Không. Chúng tôi không bán dữ liệu cá nhân của người dùng.',
      },
      {
        q: 'Tôi có bắt buộc phải tạo tài khoản không?',
        a: 'Không. Bạn có thể dùng ứng dụng mà không cần tài khoản; tài khoản chỉ phục vụ đồng bộ tiến trình.',
      },
      {
        q: 'Làm sao để xóa dữ liệu của tôi?',
        a: 'Dữ liệu trên thiết bị có thể xóa qua cài đặt trình duyệt. Dữ liệu tài khoản có thể yêu cầu xóa qua phần góp ý.',
      },
    ],
    related: ['dieu-khoan-su-dung', 'noi-quy', 'gioi-thieu', 'hoi-dap', 'huong-dan-di-chua-online'],
  },
  // ───────────────────────────── dieu-khoan-su-dung
  {
    slug: 'dieu-khoan-su-dung',
    title: 'Điều khoản sử dụng – Chùa Liên Hoa',
    description:
      'Điều khoản sử dụng Chùa Liên Hoa: phần mềm độc lập, không phải chùa thật; quy tắc ứng xử, giới hạn trách nhiệm, tài khoản, nội dung kinh văn.',
    h1: 'Điều khoản sử dụng Chùa Liên Hoa',
    sections: [
      {
        h2: 'Bản chất của ứng dụng',
        p: [
          'Chùa Liên Hoa là một phần mềm độc lập, mô phỏng không gian chùa bằng đồ họa ba chiều để hỗ trợ việc tịnh tâm, niệm Phật, tụng kinh và thiền. Đây không phải là một ngôi chùa thật, không thuộc về bất kỳ tổ chức tôn giáo nào, và không có thầy hay tu sĩ nào đại diện. Các hoạt động trong ứng dụng như thắp hương, thả đèn hay xin quẻ chỉ mang tính mô phỏng, giải trí và nhắc nhở tích cực. Bằng việc sử dụng ứng dụng, bạn xác nhận đã đọc và đồng ý với những điều khoản dưới đây.',
        ],
      },
      {
        h2: 'Quy tắc sử dụng',
        p: ['Khi sử dụng, bạn đồng ý:'],
        list: [
          'Tuân thủ [nội quy cộng đồng](noi-quy), cư xử hòa nhã và tôn trọng người khác.',
          'Không mạo danh người khác, không dùng tên gọi xúc phạm, không quảng cáo hoặc bán hàng.',
          'Không can thiệp trái phép vào máy chủ, mã nguồn hoặc dữ liệu của người khác.',
          'Không dùng ứng dụng vào mục đích vi phạm pháp luật.',
        ],
      },
      {
        h2: 'Nội dung và giới hạn trách nhiệm',
        p: [
          'Kinh văn, lời dạy, lời nhắc và các bài quẻ được tổng hợp hoặc sáng tác với thiện chí, và chưa qua sự thẩm định chính thức của tổ chức Phật giáo nào. Nội dung chỉ mang tính tham khảo; bạn nên học hỏi thêm với quý thầy cô và kinh sách ấn hành. Các quẻ không phải dự đoán tương lai và không nên dùng để quyết định các việc quan trọng. Ứng dụng không thay thế cho tư vấn y tế, pháp lý, tâm lý. Nếu bạn đang gặp khủng hoảng tinh thần, hãy tìm sự trợ giúp từ người thân và chuyên gia. Chúng tôi nỗ lực giữ ứng dụng hoạt động ổn định nhưng không bảo đảm dịch vụ không gián đoạn hay không có lỗi.',
        ],
      },
      {
        h2: 'Tài khoản, dữ liệu và thay đổi điều khoản',
        p: [
          'Việc tạo tài khoản là tùy chọn. Bạn chịu trách nhiệm giữ bí mật thông tin đăng nhập. Chúng tôi có thể tạm hạn chế hoặc khóa tài khoản vi phạm nội quy. Cách chúng tôi xử lý dữ liệu được nêu trong [chính sách quyền riêng tư](chinh-sach-quyen-rieng-tu). Các điều khoản có thể được cập nhật khi cần; bản mới nhất luôn được đăng tại trang này, và việc tiếp tục sử dụng đồng nghĩa với việc bạn chấp nhận thay đổi. Nếu có thắc mắc, mời xem [hỏi đáp](hoi-dap) hoặc [giới thiệu](gioi-thieu).',
        ],
      },
    ],
    faq: [
      {
        q: 'Chùa Liên Hoa có thuộc tổ chức tôn giáo nào không?',
        a: 'Không. Đây là phần mềm độc lập, không phải chùa thật và không thuộc tổ chức tôn giáo nào.',
      },
      {
        q: 'Tôi có thể sao chép nội dung ứng dụng không?',
        a: 'Kinh văn là văn bản công cộng, còn phần giao diện và nội dung biên soạn riêng thuộc dự án. Nếu muốn trích dẫn, xin ghi nguồn và dùng với mục đích phi thương mại.',
      },
    ],
    related: ['chinh-sach-quyen-rieng-tu', 'noi-quy', 'gioi-thieu', 'hoi-dap', 'huong-dan-di-chua-online'],
  },
];

export const PAGES: Page[] = RAW_PAGES.map((p) => ({ updated: UPDATED, ...p }));

export function getPage(slug: string): Page | undefined {
  return PAGES.find((p) => p.slug === slug);
}
