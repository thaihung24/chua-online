// Nội dung "xin quẻ cho vui": 60 quẻ thơ lục bát/thất ngôn tự sáng tác.
// Không dự đoán vận mệnh; mỗi quẻ chỉ là một lời nhắc nhẹ nhàng để mình tu tập.

export interface Que {
  no: number;
  title: string;
  poem: string[];
  meaning: string;
  tone: 'lành' | 'bình' | 'nhắc';
}

type RawQue = Omit<Que, 'no'>;

// 25 quẻ "lành"
const LANH: RawQue[] = [
  {
    title: 'Quẻ Bình An',
    poem: [
      'Thở vào lòng nhẹ như mây',
      'Thở ra buông bớt những đầy lo toan',
      'Một giây tỉnh thức vẹn toàn',
      'Bình an ở giữa mỗi lần thở ra',
    ],
    meaning: 'Bình an không ở đâu xa, nó nằm ngay trong hơi thở này. Hôm nay hãy dừng lại ba hơi thở mỗi khi thấy lòng vội.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Hoa Sen',
    poem: [
      'Sen từ bùn đất vươn lên',
      'Hương thơm vẫn giữ, chẳng quên nguồn trong',
      'Giữa đời bận rộn đông đông',
      'Giữ lòng thanh tịnh như bông sen này',
    ],
    meaning: 'Giữa ồn ào, ta vẫn có thể giữ lòng nhẹ nhàng và trong sáng. Hãy thử làm một việc nhỏ thật chân thành trong hôm nay.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Từ Bi',
    poem: [
      'Một lời hỏi han dịu dàng',
      'Cũng là hạt giống từ bi gieo trồng',
      'Thương người, ta nhẹ cõi lòng',
      'Bắt đầu từ việc nhỏ trong hôm nay',
    ],
    meaning: 'Từ bi bắt đầu từ những cử chỉ rất nhỏ. Hôm nay hãy hỏi thăm một người bằng giọng nói thật hiền.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Tri Ân',
    poem: [
      'Biết ơn bát cơm hôm nay',
      'Biết ơn bàn tay trồng cây nấu nồi',
      'Lòng ơn như ngọn đèn soi',
      'Sáng cho ngày mới nhẹ nhàng bước đi',
    ],
    meaning: 'Lòng biết ơn làm cho những điều giản dị trở nên quý giá. Tối nay hãy nhớ ra ba điều mình thấy biết ơn.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Hỷ Xả',
    poem: [
      'Buông đi một chút giận hờn',
      'Lòng nghe nhẹ tựa như cơn gió chiều',
      'Vui cùng niềm vui của nhiều',
      'Tùy hỷ là chiếc cầu yêu thương gần',
    ],
    meaning: 'Buông bớt một điều nhỏ, lòng sẽ nhẹ đi một chút. Hãy thử mừng vui với thành quả của một người quanh mình.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Ánh Đèn',
    poem: [
      'Một ngọn đèn nhỏ giữa đêm',
      'Cũng đủ soi sáng góc thềm bước chân',
      'Thắp lên một chút lòng lành',
      'Người bên cạnh cũng thấy mình ấm hơn',
    ],
    meaning: 'Một hành động tử tế nhỏ cũng có thể làm ấm cả một khoảnh khắc. Hôm nay hãy thắp lên một ánh đèn cho người bên cạnh.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Chánh Niệm',
    poem: [
      'Rửa chén thì biết đang rửa',
      'Bước đi thì biết bàn chân chạm đường',
      'Có mặt trọn vẹn từng giây',
      'Thì nơi đâu cũng là vườn bình yên',
    ],
    meaning: 'Làm gì thì biết mình đang làm việc ấy, đó là chánh niệm. Hãy chọn một việc quen thuộc hôm nay và làm thật chậm, thật tỉnh.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Nụ Cười',
    poem: [
      'Nụ cười chẳng tốn đồng nào',
      'Mà làm ấm được biết bao tấm lòng',
      'Hôm nay thử mỉm cười chào',
      'Một người xa lạ, thấy trong lòng vui',
    ],
    meaning: 'Một nụ cười chân thành là món quà không cần chuẩn bị. Hãy mỉm cười với người đầu tiên mình gặp hôm nay.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Lời Hiền',
    poem: [
      'Lời hiền như nước mát trong',
      'Tưới lên đất khát giữa lòng người nghe',
      'Chọn lời chân thật dịu hòa',
      'Mỗi câu là một cành hoa tặng người',
    ],
    meaning: 'Lời nói dịu hiền có sức làm dịu cả người nói lẫn người nghe. Hôm nay hãy chọn một câu nói nhẹ nhàng hơn thường lệ.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Bố Thí',
    poem: [
      'Cho đi chẳng sợ vơi đầy',
      'Hạt cơm manh áo trao tay nhẹ nhàng',
      'Lòng rộng thì cõi cũng rộng',
      'Cho mà không tính, bình an đầy lòng',
    ],
    meaning: 'Sự sẻ chia, dù rất nhỏ, làm lòng mình rộng ra. Hãy chia sẻ một điều gì đó, một lời hay hoặc một chút thời gian, với ai cần.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Trăng Thanh',
    poem: [
      'Trăng thanh soi xuống mặt hồ',
      'Lòng yên thì thấy đường đi rõ ràng',
      'Đừng vội khuấy nước đục lên',
      'Đợi cho lắng lại, trăng liền hiện ra',
    ],
    meaning: 'Khi tâm lắng xuống, mình nhìn mọi việc rõ ràng hơn. Trước khi quyết định điều gì hôm nay, hãy dừng lại một nhịp thở.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Gió Mát',
    poem: [
      'Gió chiều thổi nhẹ qua hiên',
      'Mang theo hơi mát dịu hiền cho ta',
      'Dừng chân hít một hơi dài',
      'Thấy mình còn được thở ra, thở vào',
    ],
    meaning: 'Có những niềm vui rất giản dị như làn gió mát. Hãy dừng lại một phút để cảm nhận hơi thở và biết ơn vì mình đang có mặt.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Suối Nguồn',
    poem: [
      'Suối trong bắt đầu từ nguồn',
      'Lòng lành cũng bắt đầu từ ý hiền',
      'Mỗi sáng gìn giữ ý lành',
      'Dòng đời có đục cũng thành trong xanh',
    ],
    meaning: 'Ý nghĩ lành là nguồn của lời nói và việc làm tốt đẹp. Sáng nay hãy gieo một ý nguyện hiền trước khi bắt đầu ngày mới.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Bồ Đề',
    poem: [
      'Gốc Bồ Đề rợp bóng râm',
      'Ngồi yên một lát, lòng dần lặng đi',
      'Tâm sáng là cội Bồ Đề',
      'Mang theo bên mình đi về mọi nơi',
    ],
    meaning: 'Sự tỉnh sáng trong tâm có thể mang theo mọi lúc. Hãy ngồi yên vài phút hôm nay, không làm gì cả, chỉ có mặt.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Tiếng Chuông',
    poem: [
      'Chuông ngân một tiếng nhẹ nhàng',
      'Nghe rồi dừng lại, bao ngàn nghĩ suy',
      'Hít vào, mình đã có đây',
      'Thở ra, mỉm nụ cười đầy thảnh thơi',
    ],
    meaning: 'Tiếng chuông là lời mời dừng lại và trở về với hơi thở. Mỗi khi nghe một âm thanh quen thuộc hôm nay, hãy thử thở chậm một nhịp.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Hương Trầm',
    poem: [
      'Khói hương lên giữa chiều tà',
      'Lòng thành giản dị, chan hòa mà thôi',
      'Không cần cao giọng cầu xin',
      'Chỉ cần tâm lặng, hương in dấu lòng',
    ],
    meaning: 'Sự thành tâm quan trọng hơn mọi nghi thức. Hãy thắp một nén hương, hoặc chỉ cần lặng lòng, với tâm chân thật.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Mầm Xanh',
    poem: [
      'Mầm xanh nhú giữa đất khô',
      'Kiên trì từng chút, chẳng lo vội vàng',
      'Việc lành gieo mỗi hôm nay',
      'Tự nhiên lớn lên từng ngày thầm lặng',
    ],
    meaning: 'Việc tu tập cũng như hạt mầm, cần chăm sóc đều đặn mỗi ngày. Hãy giữ một thói quen nhỏ và đều đặn thay vì cố làm thật nhiều.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Bình Minh',
    poem: [
      'Bình minh lên, sáng khắp trời',
      'Một ngày mới đến, một lời nguyện hiền',
      'Dậy sớm hít thở thật sâu',
      'Nhủ lòng hôm nay nói lời dịu êm',
    ],
    meaning: 'Mỗi buổi sáng là một cơ hội để bắt đầu lại nhẹ nhàng. Hãy đặt một ý nguyện nhỏ cho ngày hôm nay.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Thong Dong',
    poem: [
      'Thong dong một bước một hơi',
      'Chẳng cần chạy kịp những lời hối thúc',
      'Đường dài có bạn là mình',
      'Biết thương bước chậm, lòng bình lặng đi',
    ],
    meaning: 'Đi chậm lại không phải là bỏ lỡ, mà là có mặt với từng bước. Hôm nay hãy thử đi một đoạn đường thật chậm và biết rõ từng bước chân.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Sum Vầy',
    poem: [
      'Bữa cơm cùng ngồi bên nhau',
      'Không điện thoại, chỉ nhìn nhau mỉm cười',
      'Trân trọng người thân bên mình',
      'Là nuôi dưỡng chút hiếu tình mỗi ngày',
    ],
    meaning: 'Có mặt trọn vẹn bên người thân là một cách thể hiện tình thương. Hôm nay hãy dành một bữa ăn không màn hình cùng người thân.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Tinh Tấn',
    poem: [
      'Mỗi ngày một chút công phu',
      'Giọt nước nhỏ mãi cũng mòn đá xanh',
      'Năm phút tụng niệm đều đều',
      'Hơn cả một lần dốc sức rồi quên',
    ],
    meaning: 'Sự đều đặn quan trọng hơn sự thật nhiều. Hãy chọn một việc tu tập nhỏ và giữ đều trong vài ngày tới.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Hoan Hỷ',
    poem: [
      'Vui theo nắng sớm trên cành',
      'Vui theo tiếng trẻ, tiếng chim đầu ngày',
      'Niềm vui giản dị quanh đây',
      'Chỉ cần dừng lại là đầy trong tay',
    ],
    meaning: 'Niềm vui thường nằm sẵn trong những điều nhỏ bé quanh ta. Hãy tìm ra một điều khiến mình mỉm cười trong hôm nay.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Thanh Tịnh',
    poem: [
      'Nước trong thấy rõ đáy hồ',
      'Lòng trong thấy rõ những gì đang đi',
      'Mỗi tối lặng ngồi vài phút',
      'Lòng như mặt nước lắng dần trong veo',
    ],
    meaning: 'Dành vài phút yên tĩnh mỗi ngày giúp tâm trong sáng trở lại. Tối nay hãy ngồi yên một lúc trước khi ngủ.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Nhẫn Nại',
    poem: [
      'Gặp điều trái ý, hít sâu',
      'Đếm ba hơi thở, lòng sau dịu dần',
      'Nhẫn không phải chịu thiệt thòi',
      'Mà là giữ được tấm lòng thảnh thơi',
    ],
    meaning: 'Nhẫn nại là giữ cho lòng mình bình tĩnh, không phải chịu đựng một cách miễn cưỡng. Khi gặp điều khó chịu, hãy thở ba hơi trước khi đáp lại.',
    tone: 'lành',
  },
  {
    title: 'Quẻ Gieo Hạt Lành',
    poem: [
      'Gieo hạt lành giữa đời thường',
      'Một lời cảm tạ, một đường nhường nhau',
      'Chẳng cần chờ có ai hay',
      'Mình làm thiện nhỏ, tâm này nhẹ ngay',
    ],
    meaning: 'Việc thiện nhỏ làm trong âm thầm vẫn khiến lòng mình nhẹ nhàng. Hôm nay hãy làm một việc tốt mà không cần ai biết.',
    tone: 'lành',
  },
];

// 20 quẻ "bình"
const BINH: RawQue[] = [
  {
    title: 'Quẻ Trầm Lắng',
    poem: [
      'Chiều xuống, mái chùa lặng im',
      'Ngồi nghe thinh lặng, chim đang gọi bầy',
      'Không cần tìm kiếm điều chi',
      'Ngồi yên, lòng sẽ tự đi về nhà',
    ],
    meaning: 'Có những lúc không cần làm gì thêm, chỉ cần lặng yên. Hãy cho mình vài phút im lặng mà không tìm kiếm điều gì.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Sương Sớm',
    poem: [
      'Sương mai đọng trên lá xanh',
      'Mong manh mà vẫn long lanh sáng ngời',
      'Mọi điều đến rồi sẽ qua',
      'Nhìn với lòng nhẹ, cho ta bớt đầy',
    ],
    meaning: 'Mọi thứ đều thay đổi, nên có thể nhìn chúng với lòng nhẹ nhàng. Hãy ngắm một điều đẹp đẽ nhỏ bé hôm nay mà không nắm giữ.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Con Đường',
    poem: [
      'Con đường dài hay ngắn thôi',
      'Quan trọng bước tới từng nơi tỉnh thức',
      'Đi bằng cả trái tim hiền',
      'Đến đâu cũng thấy bình yên bên mình',
    ],
    meaning: 'Điều đáng quý là cách ta bước đi chứ không chỉ nơi đến. Hãy thử đi một đoạn đường hôm nay thật tỉnh táo và nhẹ nhàng.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Bước Chậm',
    poem: [
      'Chậm lại một nhịp thôi mà',
      'Thấy hoa nở ngoài hiên nhà từ lâu',
      'Bao điều ở sát bên ta',
      'Chỉ vì vội vã nên là chưa thấy',
    ],
    meaning: 'Chỉ cần chậm lại, ta sẽ nhận ra nhiều điều đẹp quanh mình. Hôm nay hãy thử giảm tốc độ một chút trong một việc quen thuộc.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Mây Trôi',
    poem: [
      'Mây trôi qua đỉnh núi xa',
      'Ý nghĩ đến rồi cũng là trôi đi',
      'Ngồi nhìn mà chẳng đuổi theo',
      'Bầu trời trong rộng vẫn đều nơi đây',
    ],
    meaning: 'Ý nghĩ như mây, đến rồi đi, còn bầu trời tâm vẫn luôn rộng mở. Khi có điều lo nghĩ, hãy nhìn nó trôi qua như một đám mây.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Chén Trà',
    poem: [
      'Chén trà ấm giữa hai tay',
      'Uống từng ngụm nhỏ, thấy ngày chậm trôi',
      'Chỉ uống trà thôi, lặng thầm',
      'Một giờ như thế cũng đầy nghĩa thiền',
    ],
    meaning: 'Một việc đơn giản làm với sự chú tâm cũng là thiền. Hãy thưởng thức một chén nước hoặc trà mà không làm thêm việc gì khác.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Hơi Thở',
    poem: [
      'Hít vào biết mình hít vào',
      'Thở ra biết rõ thở ra nhẹ nhàng',
      'Chỉ vậy thôi, chẳng gì hơn',
      'Mà là cánh cửa dẫn vào bình yên',
    ],
    meaning: 'Theo dõi hơi thở là cách đơn giản nhất để trở về với hiện tại. Hãy thở chậm và biết rõ mười hơi thở liên tiếp.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Tĩnh Lặng',
    poem: [
      'Giữa muôn tiếng động ngoài đời',
      'Vẫn còn một góc trong người lặng im',
      'Về đó nghỉ một phút thôi',
      'Rồi ra, bước tiếp nhẹ tênh hơn nhiều',
    ],
    meaning: 'Trong mỗi người đều có một góc yên tĩnh để trở về. Giữa công việc hôm nay, hãy nghỉ một phút ở góc ấy.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Lắng Nghe',
    poem: [
      'Nghe người nói hết câu rồi',
      'Đừng vội đáp lại, hãy ngồi lắng nghe',
      'Đôi khi chỉ một cái nhìn',
      'Cũng là món quà đáng tin của lòng',
    ],
    meaning: 'Lắng nghe trọn vẹn là một cách thương yêu thầm lặng. Hôm nay hãy nghe một người nói đến hết câu mà không ngắt lời.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Giản Dị',
    poem: [
      'Áo sờn, cơm đạm, nhà thưa',
      'Mà lòng thanh thản như vừa nắng lên',
      'Bớt đi một món ham muốn',
      'Thêm phần nhẹ gánh trên đường mình đi',
    ],
    meaning: 'Sống giản dị giúp lòng nhẹ nhàng hơn. Hãy thử bớt đi một thứ không thật cần thiết trong hôm nay.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Vừa Đủ',
    poem: [
      'Ăn vừa đủ, ngủ vừa đủ',
      'Nói vừa đủ nghe, lòng thêm nhẹ nhàng',
      'Việc làm vừa sức, vừa tâm',
      'Biết vừa là thấy tâm an thêm nhiều',
    ],
    meaning: 'Biết điều độ trong ăn, ngủ và lời nói giúp cuộc sống cân bằng. Hôm nay hãy chú ý đến cảm giác "vừa đủ" của mình.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Chờ Đợi',
    poem: [
      'Hạt mầm cần có thời gian',
      'Đừng kéo ngọn lá cho nhanh lớn lên',
      'Việc gì cũng có nhịp riêng',
      'Kiên nhẫn là cách giữ yên tấm lòng',
    ],
    meaning: 'Mọi việc đều có nhịp độ riêng của nó. Hãy tập kiên nhẫn một chút với điều mình đang mong chờ.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Mặt Hồ',
    poem: [
      'Mặt hồ phẳng lặng như gương',
      'Gió lay thì gợn, gió nhường lại yên',
      'Lòng ta cũng vậy mà thôi',
      'Đợi cơn gió lặng, tâm nơi trở về',
    ],
    meaning: 'Tâm khi xao động cũng sẽ có lúc lắng lại nếu ta kiên nhẫn chờ. Hãy cho mình thời gian để lắng, đừng ép mình phải bình tĩnh ngay.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Lá Rơi',
    poem: [
      'Lá vàng rơi xuống sân chùa',
      'Không buồn, không tiếc, như vừa chào thu',
      'Mọi thứ đổi thay lặng thầm',
      'Mình học cách đón, cách buông nhẹ nhàng',
    ],
    meaning: 'Thay đổi là điều tự nhiên, học cách đón nhận sẽ giúp lòng nhẹ hơn. Hãy nhìn một điều đang thay đổi quanh mình với lòng thanh thản.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Ngày Thường',
    poem: [
      'Một ngày bình thường thôi mà',
      'Có hơi thở, có người ta quý thương',
      'Nhận ra những điều nhỏ nhoi',
      'Chính là hạnh phúc sẵn nơi tay mình',
    ],
    meaning: 'Một ngày bình thường cũng chứa nhiều điều đáng quý. Hãy nhận ra ba điều nhỏ bé mà mình đang có.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Ngồi Yên',
    poem: [
      'Ngồi yên như núi giữa trời',
      'Gió qua mặc gió, tiếng đời mặc xa',
      'Mười phút thôi cũng đủ rồi',
      'Để lòng làm quen với ta thật gần',
    ],
    meaning: 'Ngồi yên là cách làm quen lại với chính mình. Hôm nay hãy thử ngồi thiền mười phút, hoặc ít hơn nếu mình cần.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Tùy Duyên',
    poem: [
      'Việc đến thì làm hết lòng',
      'Việc đi thì để nhẹ trong tay buông',
      'Tùy duyên mà chẳng buông xuôi',
      'Làm tròn phần mình, thảnh thơi cõi lòng',
    ],
    meaning: 'Tùy duyên là làm hết phần mình rồi nhẹ nhàng chấp nhận kết quả. Hãy làm một việc trọn vẹn hôm nay và đừng quá bám víu vào kết quả.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Quán Chiếu',
    poem: [
      'Nhìn vào mình một phút thôi',
      'Thấy giận đang dấy, thấy vui đang về',
      'Chỉ nhìn, chưa vội chê, khen',
      'Hiểu mình là bước đầu tiên dịu dàng',
    ],
    meaning: 'Quan sát cảm xúc của mình mà không phán xét là bước đầu của sự hiểu mình. Hãy tự hỏi lúc này lòng mình đang thế nào.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Hạt Mưa',
    poem: [
      'Hạt mưa rơi xuống mái hiên',
      'Nghe như nhạc khẽ bình yên giữa chiều',
      'Mưa rơi cũng chẳng cần ngăn',
      'Ngồi nghe, thấy lòng bớt dần ồn ào',
    ],
    meaning: 'Thời tiết hay hoàn cảnh nhiều khi ta không đổi được, nhưng ta có thể đổi cách đón nhận. Hãy lắng nghe một âm thanh tự nhiên trong vài phút.',
    tone: 'bình',
  },
  {
    title: 'Quẻ Cội Cây',
    poem: [
      'Cội cây đứng giữa gió đông',
      'Rễ sâu nên vẫn thong dong trước trời',
      'Giữ gìn gốc rễ trong lòng',
      'Là giữ mấy điều đơn sơ mỗi ngày',
    ],
    meaning: 'Những thói quen giản dị mỗi ngày là gốc rễ giúp ta vững vàng. Hãy giữ lại một thói quen tốt mà mình đã có.',
    tone: 'bình',
  },
];

// 15 quẻ "nhắc"
const NHAC: RawQue[] = [
  {
    title: 'Quẻ Buông Giận',
    poem: [
      'Cơn giận như lửa trong tay',
      'Cầm lâu thì bỏng, thả ngay mới lành',
      'Hít sâu, đếm đến mười thôi',
      'Rồi hãy nói, lời sẽ dịu hơn nhiều',
    ],
    meaning: 'Khi giận, hãy dừng lại và thở trước khi nói hay làm điều gì. Lời nói sau vài hơi thở thường nhẹ nhàng và rõ ràng hơn.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Bớt Vội',
    poem: [
      'Vội vàng chi mãi hôm nay',
      'Dừng chân thấy được tháng ngày quanh ta',
      'Làm gì cũng một việc thôi',
      'Làm cho trọn vẹn, lòng hòa bình an',
    ],
    meaning: 'Làm từng việc một với tâm trọn vẹn sẽ nhẹ nhàng hơn là vội vàng làm nhiều việc. Hôm nay hãy thử làm một việc tại một thời điểm.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Quay Về',
    poem: [
      'Tâm chạy theo cảnh ngoài kia',
      'Mệt thì quay lại, hơi về nơi đây',
      'Niệm Phật một tiếng thật lòng',
      'Là đưa tâm lại bên trong nhà mình',
    ],
    meaning: 'Khi tâm chạy đi xa, ta có thể nhẹ nhàng đưa nó trở về bằng hơi thở hoặc một câu niệm. Đừng trách mình, chỉ cần quay lại.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Soi Mình',
    poem: [
      'Soi người thì dễ quá thay',
      'Soi mình mới thấy những ngày chưa yên',
      'Một lời tự nhắc mỗi đêm',
      'Hôm nay mình đã nhẹ lòng hơn chưa',
    ],
    meaning: 'Nhìn lại mình thường khó hơn nhìn người khác, nhưng rất có ích. Tối nay hãy nhẹ nhàng nhìn lại một ngày của mình, không trách móc.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Lời Nhẹ',
    poem: [
      'Lời nói như mũi tên bay',
      'Đã buông ra rồi khó thay thu về',
      'Trước khi nói, nghĩ một giây',
      'Lời này có thật, có hiền, có ích',
    ],
    meaning: 'Trước khi nói, hãy tự hỏi lời ấy có đúng, có hiền và có ích không. Một giây suy nghĩ có thể tránh được nhiều điều tiếc nuối.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Đừng So Sánh',
    poem: [
      'Đem mình so với người ta',
      'Hoa nào cũng có mùa hoa riêng mình',
      'Bớt nhìn vườn của người ta',
      'Chăm cho vườn của nhà mình mỗi ngày',
    ],
    meaning: 'Mỗi người có hoàn cảnh và nhịp đi riêng, so sánh dễ làm lòng nặng nề. Hôm nay hãy chăm sóc việc của mình thay vì nhìn sang người khác.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Bớt Phán Xét',
    poem: [
      'Chưa biết hết chuyện của người',
      'Đừng vội kết luận một lời chê khen',
      'Ai cũng có nỗi riêng mang',
      'Hiểu thêm một chút, thương thêm một phần',
    ],
    meaning: 'Ta thường chỉ thấy một phần câu chuyện của người khác. Hãy thử nghĩ tốt cho ai đó mà hôm nay mình đang muốn trách.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Biết Đủ',
    poem: [
      'Muốn nhiều thì khổ nhiều thêm',
      'Biết đủ là ngọn đèn êm giữa lòng',
      'Hôm nay thử đếm những gì',
      'Mình đang có sẵn, bớt đi so đo',
    ],
    meaning: 'Biết đủ giúp lòng nhẹ hơn nhiều so với đuổi theo mong muốn không dừng. Hãy liệt kê trong đầu những điều mình đang có.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Sám Hối',
    poem: [
      'Nhận ra một lỗi nhỏ thôi',
      'Thành tâm xin lỗi, lòng người nhẹ đi',
      'Sám hối không phải tự chê',
      'Là cho mình cơ hội về với hiền',
    ],
    meaning: 'Biết nhận lỗi và xin lỗi chân thành giúp lòng nhẹ nhàng hơn. Nếu có ai mình lỡ làm phiền, hãy gửi lời xin lỗi hôm nay.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Chuyên Cần',
    poem: [
      'Lười thì để mãi ngày mai',
      'Chuyên cần một chút, hôm nay bắt đầu',
      'Mỗi sáng năm phút niệm kinh',
      'Giữ đều như thể giữ mình trong xanh',
    ],
    meaning: 'Việc tốt cần bắt đầu từ hôm nay, dù chỉ rất nhỏ. Hãy chọn năm phút công phu và bắt đầu ngay.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Giữ Giới',
    poem: [
      'Giữ lời, giữ ý, giữ thân',
      'Ba điều giản dị mà cần xưa nay',
      'Mỗi ngày kiểm lại một lần',
      'Hôm nay mình đã nhẹ nhàng với ai',
    ],
    meaning: 'Giữ gìn lời nói, ý nghĩ và hành động là nền tảng của một tâm an. Cuối ngày hãy nhẹ nhàng nhìn lại cách mình đối xử với mọi người.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Rời Màn Hình',
    poem: [
      'Tay cầm điện thoại thâu canh',
      'Bao nhiêu hơi thở bỏ quanh lặng thầm',
      'Đặt xuống năm phút thôi mà',
      'Nhìn trời, nhìn lá, nhìn ta đang về',
    ],
    meaning: 'Rời khỏi màn hình một lúc giúp ta nhận ra những điều thật quanh mình. Hãy đặt điện thoại xuống năm phút và nhìn ra ngoài cửa sổ.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Nhớ Hiếu',
    poem: [
      'Cha mẹ ở đó bao năm',
      'Một cuộc gọi ngắn, một lần hỏi thăm',
      'Hiếu không phải việc lớn lao',
      'Là lời quan tâm gửi vào hôm nay',
    ],
    meaning: 'Hiếu thảo bắt đầu từ sự quan tâm giản dị. Hôm nay hãy gọi hoặc nhắn hỏi thăm một người lớn tuổi trong gia đình.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Thương Mình',
    poem: [
      'Mình sai thì cũng là người',
      'Đừng nên trách mãi, hãy cười nhận ra',
      'Thương mình cũng là tu hành',
      'Ngày mai khởi lại, lòng lành vẫn đây',
    ],
    meaning: 'Biết thương mình là điều kiện để thương được người khác. Nếu hôm nay có điều chưa tốt, hãy nhẹ nhàng bắt đầu lại.',
    tone: 'nhắc',
  },
  {
    title: 'Quẻ Tỉnh Thức',
    poem: [
      'Có mặt ngay lúc này đây',
      'Quá khứ đã qua, ngày mai chưa về',
      'Chỉ còn hơi thở trong tay',
      'Giữ cho tỉnh thức từng giây dịu dàng',
    ],
    meaning: 'Quá khứ đã qua, tương lai chưa tới, chỉ có giây phút hiện tại để thực hành. Hãy thở và biết mình đang ở đây.',
    tone: 'nhắc',
  },
];

// Xen kẽ ba nhóm để các quẻ liên tiếp có nhiều sắc thái khác nhau (25 lành / 20 bình / 15 nhắc).
const PATTERN: Array<'l' | 'b' | 'n'> = ['l', 'b', 'l', 'n', 'b', 'l', 'b', 'n', 'l', 'b', 'n', 'l'];

function buildQueList(): Que[] {
  const pools = { l: [...LANH], b: [...BINH], n: [...NHAC] };
  const out: Que[] = [];
  for (let i = 0; i < 60; i++) {
    const raw = pools[PATTERN[i % PATTERN.length]].shift() as RawQue;
    out.push({ no: i + 1, ...raw });
  }
  return out;
}

export const QUE_LIST: Que[] = buildQueList();

/** Rút quẻ xác định theo hạt giống: chỉ số = |floor(seed)| mod 60; giá trị không hợp lệ → 0. */
export function drawQue(seed: number): Que {
  const s = Number.isFinite(seed) ? Math.abs(Math.floor(seed)) : 0;
  return QUE_LIST[s % QUE_LIST.length];
}
