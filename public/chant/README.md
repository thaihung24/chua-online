# Thư mục giọng niệm Phật (`public/chant/`)

Thư mục này chứa các bản thu âm niệm Phật thực tế phát trong tính năng **Nghe niệm Phật** (nút tai nghe góc trên màn hình & hộp thoại *Nghe niệm Phật*).

### 1. Các giọng & nhịp mõ có sẵn mặc định
- `nam-tram.m4a` — *Niệm Phật 6 chữ - Nam Mô A Di Đà Phật - Thầy Thích Trí Thoát* (bản gốc trọn chu kỳ 4 phút 11 giây lặp liền mạch).
- `chuong-mo.m4a` — *Tiếng gõ mõ tĩnh tâm* (50 giây đầu tiếng gõ mõ và chuông gia trì thu thật, lặp liền mạch không ngắt nhịp).
- `_mo-hit.wav` — Mẫu một nhịp tiếng gõ mõ thu thật dùng cho tương tác gõ mõ trong *Tụng kinh* và *Lần tràng hạt* (tiền tố `_` để không liệt kê thành bài phát riêng).
- `hop-xuong.m4a` — Đạo tràng đại chúng hòa giọng niệm *Nam Mô A Di Đà Phật* trang nghiêm.
- `nu-trong.m4a` — Giọng nữ trong trẻo, êm dịu niệm *Nam Mô A Di Đà Phật*.

### 2. Tự thay thế hoặc thêm giọng niệm riêng (`.mp3`, `.m4a`, `.ogg`, `.wav`, `.aac`, `.flac`)
- **Thay thế giọng mặc định**: đặt tệp trùng tên gốc (ví dụ `nam-tram.mp3`, `nu-trong.mp3`, `hop-xuong.mp3`) vào `public/chant/` — hệ thống tự ưu tiên phát tệp `.mp3` mới của bạn.
- **Thêm mục niệm mới vào danh sách chọn**: chỉ cần chép bất kỳ tệp âm thanh nào (ví dụ `Thầy Thích Trí Thoát 4 chữ.mp3` hoặc `Niệm Quan Thế Âm.mp3`) vào `public/chant/`. Máy chủ sẽ tự nhận diện ngay và hiện thêm lựa chọn đó trong hộp thoại **Nghe niệm Phật** mà không cần sửa code.
