# Chùa Rắn — Chùa online 3D miễn phí

Ứng dụng web **chùa online 3D nhiều người dùng** (TypeScript + Three.js + WebAudio tổng hợp + Node/Express + WebSocket), giao diện tiếng Việt tôn nghiêm và ấm áp: dạo khuôn viên chùa, lễ Phật, thắp hương, dâng hoa, thắp nến, thỉnh chuông, quét lá bồ đề, lần tràng hạt 108 hạt, tụng kinh gõ mõ, ngồi thiền định, thiền hành, thả đèn hoa đăng, xin quẻ tu tập, treo nguyện cây bồ đề, xem lịch âm Việt Nam và cùng công phu trực tuyến chung trong một không gian chùa duy nhất.

> Lưu ý: **Chùa Rắn** là dự án phần mềm độc lập nhằm tạo không gian tịnh tâm trực tuyến miễn phí, không phải ngôi chùa thật và không thuộc bất kỳ cơ sở hay tổ chức tôn giáo nào.

## Tính năng chính

- **Khuôn viên chùa 3D dựng thủ tục (Three.js, < 120 draw calls)**:
  - Cổng Tam Quan, sân gạch lát biến thiên, chậu bonsai, đèn đá, cờ phướn, giá chổi & 108 lá bồ đề rụng quét được.
  - Đại Hùng Bảo Điện (*Từ Bi Hỷ Xả*), tượng Phật Thích Ca toà sen vàng, đôi hạc đồng cưỡi rùa, bàn thờ lễ vật động (hương cháy toả khói, hoa sen tươi, nến nhấp nháy).
  - Gác chuông đồng đung đưa kèm sóng ánh sáng khi thỉnh chuông; bàn xin xăm.
  - Ao sen có cá koi bơi, hoa sen nở và đèn hoa đăng trôi toả sáng về đêm; hồ phóng sinh có bến gỗ.
  - Cây bồ đề cổ thụ treo ruy-băng lời nguyện đung đưa theo gió & hái lộc vàng; Vườn Quan Âm tượng bạch ngọc; Vườn thiền sỏi cào 8 bồ đoàn; Giếng ngọc & dòng suối chảy ra hồ sen.
  - Chu kỳ ngày / hoàng hôn / đêm theo giờ Việt Nam (UTC+7), bụi nắng ban ngày, sao trời & đom đóm ban đêm.
- **Nhân vật Chibi & điều khiển mượt mà**:
  - 2 giới tính × 4 kiểu áo (*Tràng xám, Tràng lam, Bà ba, Áo dài*) × 5 sắc màu + 7 pháp khí mở khoá theo cấp + vòng hào quang 7 bậc sen.
  - Hỗ trợ đầy đủ cả điện thoại (cần điều khiển ảo bên trái, vuốt xoay góc nhìn bên phải, chạm mặt sân tự tìm đường A*) và máy tính (`WASD` / mũi tên, `Q/E`, kéo chuột, cuộn zoom, phím `F` tương tác ngữ cảnh).
- **21 màn hình & hộp thoại công phu**:
  - *Niệm Phật* (tràng hạt 27/54/108 hạt xoay mượt), *Tụng kinh* (14 bài kinh/chú/kệ kèm gõ mõ từng chữ hoặc mõ tự động 60–120 BPM & Thời khóa liên hoàn), *Thiền định* (nhịp thở 4–2–6s, chuông định kỳ, Wake Lock), *Thiền hành*, *Nghe niệm Phật* (4 giọng tổng hợp), *Pháp thoại*, *Hôm nay & Lịch âm Hồ Ngọc Đức (1801–2199)*, *Thả đèn hoa đăng*, *Xin quẻ tu tập (60 quẻ)*, *Treo nguyện cây bồ đề*, *Tủ trang phục*, *Hành trình (7 bậc sen, chuỗi giữ lửa, ngày nghỉ, 21 dấu ấn, sổ hành hương)*, *Bảng xếp hạng*, *Không gian chùa chung*, *Bạn đạo*, *Tài khoản & Đồng bộ đám mây*, *Khoe thành tích (xuất ảnh 1080×1350)*, *Góp ý*, *Cài ứng dụng PWA*, *Cài đặt*.
- **Âm thanh tổng hợp 100% bằng WebAudio** (không dùng tệp âm thanh ngoài): tiếng mõ gỗ, đại hồng chung, chuông gió, chuỗi hạt, gió, suối, chim ban ngày, dế ban đêm, pad ngũ cung và đài niệm Phật formant.
- **Máy chủ nhiều người dùng & 42 trang SEO tĩnh**:
  - Express + `ws` đồng bộ vị trí 5Hz, lời chào định sẵn, thả đèn chung, giới hạn tốc độ & chống gian lận, xác thực `scrypt` + cookie phiên `httpOnly`, nén gzip và CSP chặt chẽ.
  - Trình tạo trang tĩnh `scripts/build-seo.ts` xuất 42 bài hướng dẫn, toàn văn 14 bài kinh, lịch âm tương tác, `sitemap.xml` và `robots.txt`.

## Khởi chạy

```bash
# Cài đặt phụ thuộc
npm install

# Chạy môi trường phát triển (Vite cổng 5173 + API/WS cổng 8787)
npm run dev

# Chạy toàn bộ bộ kiểm thử tự động (Vitest: lịch âm, tiến độ, nội dung, HTTP/WS server)
npm test

# Đóng gói bản Production (kiểm tra kiểu TypeScript + Vite bundle + sinh 42 trang SEO tĩnh)
npm run build

# Khởi chạy máy chủ Production (phục vụ cả ứng dụng 3D, trang SEO, API và WebSocket tại cổng 8787)
npm start

# Kiểm thử tích hợp đầu-cuối (E2E) với Chrome thật & nhiều người chơi
node scripts/e2e-verify.mjs
```

## Biến môi trường máy chủ (tuỳ chọn)

| Biến | Mặc định | Ý nghĩa |
|------|----------|---------|
| `PORT` / `API_PORT` | `8787` | Cổng lắng nghe HTTP & WebSocket |
| `HOST` | `0.0.0.0` | Địa chỉ lắng nghe |
| `DATA_DIR` | `./data` | Thư mục lưu cơ sở dữ liệu JSON nguyên tử & góp ý |
| `DIST_DIR` | `./dist` | Thư mục bản dựng tĩnh |
| `SITE_URL` | `https://chualienhoa.vn` | URL gốc dùng khi sinh canonical & `sitemap.xml` |
| `COOKIE_SECURE` | `0` | Đặt `1` khi chạy sau HTTPS |
| `TRUST_PROXY` | `0` | Số tầng reverse proxy tin cậy |
| `ADMIN_TOKEN` | *(trống)* | Mã quản trị cho `/api/admin/ban` (tắt nếu để trống) |

## Cấu trúc thư mục

- `src/core/` — Hợp đồng kiểu (`contracts.ts`), lịch âm Hồ Ngọc Đức (`lunar.ts`), tiến độ/nhiệm vụ/dấu ấn (`progress.ts`, `quests.ts`), hồ sơ pháp danh (`profile.ts`), lưu trữ cục bộ (`store.ts`).
- `src/world/` — Cảnh quan chùa 3D dựng thủ tục (`environment.ts`, `env/*`), nhân vật chibi & phụ kiện (`avatar/*`), điều khiển/camera/tìm đường A* (`player/*`, `nav.ts`, `index.ts`).
- `src/audio/` — Bộ tổng hợp âm thanh WebAudio (`engine.ts`, `sfx.ts`, `ambient.ts`, `chant.ts`).
- `src/ui/` — Khung giao diện, màn hình mở đầu, tạo nhân vật, HUD, thanh công phu, 21 panel (`panels/*`).
- `src/content/` — Kinh văn Hán-Việt/Việt, 60 quẻ tu tập, lời dạy, lời nhắc, câu chào, pháp thoại, bài viết SEO.
- `src/net/` & `server/` — Máy chủ Express + WebSocket nhiều người chơi, xác thực, bảng xếp hạng, bạn đạo & client tự nối lại.
- `scripts/` & `tests/` — Sinh trang SEO tĩnh (`build-seo.ts`), sinh biểu tượng PWA (`make-icons.mjs`), kiểm thử đơn vị & E2E (`e2e-verify.mjs`).
# chua-online
