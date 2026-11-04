# Thư mục nhạc nền chung của Chùa Bình Thạnh (`public/music/`)

Bạn có 2 cách cực dễ để mở nhạc cho **tất cả người chơi trong chùa cùng nghe**:

### Cách A — Dùng link YouTube (`public/music/youtube.txt`)
- Mở tệp `public/music/youtube.txt` và dán link YouTube vào (mỗi dòng 1 bài, có thể ghi `Tên bài | Link`):
  ```text
  Vô Lượng Remix 1h | https://www.youtube.com/watch?v=a9jJMONsIuQ
  ```
- Lưu tệp lại là xong: máy chủ tự nhận diện ngay lập tức (không cần khởi động lại server, không cần `npm run build`) và đồng bộ cho toàn bộ người đang ở trong chùa cùng nghe đúng đoạn nhạc đó.

### Cách B — Chép tệp nhạc trực tiếp (`.mp3`, `.m4a`, `.ogg`, `.wav`, `.aac`, `.flac`)
- Kéo thả tệp nhạc trực tiếp vào thư mục `public/music/` này.
- Để quay về tiếng đàn thiền ngũ cung tổng hợp mặc định: chỉ cần xoá tệp nhạc hoặc thêm dấu `#` đầu dòng trong `youtube.txt`.
