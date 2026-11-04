# S — Máy chủ (Express + ws) và client mạng

Sở hữu: `server/**`, `src/net/**`. Cổng API mặc định 8787 (`PORT`/`API_PORT`). Không sửa file khác. Dữ liệu ở `data/` (thêm `data/` vào `.gitignore`; tạo `.gitignore` nếu chưa có: node_modules, dist, data, dev/shots).
Dùng `tsx` để chạy TS trực tiếp (`npm start` = `tsx server/index.ts`). Chỉ dùng `express`, `ws`, và Node built-ins (`node:crypto` scrypt, `node:fs/promises`...).

## HTTP API (JSON, có giới hạn tốc độ theo IP, kích thước body ≤ 32KB, CORS tắt trừ dev)
- `GET /api/health` → `{ok:true,online,rooms,uptime,version}`
- `GET /api/lobby` → `RoomInfo[]` (phòng công cộng đang mở; luôn có ít nhất 1 phòng "Chùa chính 1"; `capacity:100`).
- `POST /api/rooms` → tạo phòng riêng `RoomInfo{kind:'private', id:'p-xxxxxx'}`; tự xoá khi trống 10 phút.
- `GET /api/bxh?kind=level|streak` → `{rows:[{rank,name,level,tier,streak}]}` top 50. Nguồn: hồ sơ gửi qua WS/`PUT /api/progress` của người **đã đăng nhập** (+ khách đang online gửi `profile` kèm level — kiểm tra hợp lý: level ≤ 999, tăng quá nhanh bị bỏ qua). Làm tươi 60s, cache.
- Auth: `POST /api/auth/register {email,password,profile}`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` → `{user:{email,profile,createdAt}|null}`. Mật khẩu scrypt + salt; phiên cookie `httpOnly; SameSite=Lax; Path=/; Max-Age=30d` (token ngẫu nhiên, lưu băm); xác thực email: định dạng + độ dài; mật khẩu ≥ 8 ký tự; chống dò (giới hạn thử sai).
- `GET /api/progress`, `PUT /api/progress {state, profile}` (cần đăng nhập; lưu JSON ≤ 16KB; chỉ nhận `state` đúng kiểu; trả bản máy chủ để client hợp nhất).
- `POST /api/feedback {kind,message,email?,ua?,version?}` → ghi `data/feedback.jsonl` (≤ 1000 ký tự, giới hạn 5/giờ/IP) → `{ok:true}`.
- Bạn đạo: `GET /api/friends/me` (mã bạn đạo 6 ký tự + danh sách), `POST /api/friends/invite {code}` (gửi lời mời theo mã), `POST /api/friends/accept {code}`, `POST /api/friends/remove {code}`, `GET /api/friends/presence` (bạn đang online ở phòng nào). Cần đăng nhập.
- Admin tối thiểu: `POST /api/admin/ban {id}` với header `x-admin-token` = env `ADMIN_TOKEN` (tắt nếu không đặt).
- Phục vụ tĩnh `dist/` (nếu có) với cache hợp lý (assets hashed: immutable 1 năm; HTML no-cache), trang SEO `dist/<slug>/index.html`, SPA fallback chỉ cho đường không có phần mở rộng và không thuộc slug tĩnh; nén gzip (zlib tự viết middleware nhỏ hoặc `compression` không có — dùng `zlib` thủ công cho text lớn); header an toàn (CSP cho phép self + `ws:`/`wss:` + `img data: blob:` + `youtube`... ; X-Content-Type-Options, Referrer-Policy).
- Lưu trữ: `data/db.json` ghi nguyên tử (ghi file tạm rồi rename, debounce), cấu trúc `{users, sessions, friends, leaderboard, bans}`.

## WebSocket `/ws`
JSON frame ≤ 2KB. Client → server: `{t:'hello', profile, level, room?}` (đưa vào phòng công cộng ít đầy nhất hoặc phòng `room`; trả `{t:'welcome', id, room:RoomInfo}`), `{t:'move',x,z,ry,anim}` (≤ 10Hz, kiểm tra trong BOUNDS ±, tốc độ tối đa hợp lý ~8 m/s, dịch chuyển tức thời bị chặn/kéo về), `{t:'say',phrase}` (id phrase hợp lệ từ `src/content/phrases.ts` hoặc danh sách rút gọn trùng — import `PHRASES` từ `../src/content/phrases`; ≤ 1 câu/3s), `{t:'lantern',color}` (≤ 1/10s, màu hex hợp lệ trong `LANTERN_COLORS` hoặc mẫu `#rrggbb`), `{t:'profile',profile,level}`, `{t:'join',room}`, `{t:'ping'}`. Server → client: `{t:'players',list:RemotePlayer[]}` (chỉ người trong cùng phòng, **trừ chính mình**, snapshot 5Hz chỉ gửi khi có thay đổi, nén bằng làm tròn 2 chữ số), `{t:'say',id,text}`, `{t:'lantern',id,color,by}`, `{t:'count',online}`, `{t:'notice',text}`, `{t:'pong'}`. Giới hạn 100 người/phòng; phòng đầy tự mở phòng "Chùa chính N+1". Ping/pong 25s, ngắt kết nối chết. Chống spam (token bucket), ngắt kết nối khi vi phạm nặng. Tên người chơi được lọc (dùng `validateName` từ `../src/core/profile` — C1 viết; nếu chưa có, tạm bộ lọc riêng và đổi khi file xuất hiện).
Phát hiện hết hạn phòng riêng, dọn dẹp, tắt êm khi SIGTERM.

## Client `src/net/`
- `client.ts`: `export function createNet(): NetApi` đúng `contracts.ts`: tự kết nối WebSocket (`wss:`/`ws:` theo `location`, đường `/ws`), `connect(profile,level,roomId?)` (đọc `?room=` từ URL), tự động **kết nối lại với backoff** (1s,2s,4s… ≤ 15s), hàng đợi `sendMove` throttle 100ms chỉ gửi khi đổi, `status` events (`offline|connecting|online` + `room`), `players` (nhận snapshot → emit), `say`, `lantern`, `count`, `notice`. Nếu không kết nối được trong 6s → trạng thái `offline` (người chơi một mình, không lỗi). `lobby()` fetch `/api/lobby` (lỗi → `[]` với 1 phòng giả "Một mình"? trả `[]`). `createPrivateRoom()` POST `/api/rooms`.
- `api.ts`: `export const auth = { register(email,password,profile), login(email,password), logout(), me() }`, `rank(kind)`, `feedback(payload)`, `friends = { me(), invite(code), accept(code), remove(code), presence() }`, `progressSync = { get(), put(state, profile) }`; mọi hàm trả `{ok:true,data}` | `{ok:false,error:string(tiếng Việt)}`, không ném lỗi; timeout 8s; `credentials:'same-origin'`.
## Nghiệm thu
Viết `tests/server-*.test.ts` (vitest; chạy server thật cổng ngẫu nhiên): auth đầy đủ, lobby/rooms, 2 client WS thấy nhau + say + lantern, chặn teleport, rate-limit, bxh, feedback. Chạy `npx vitest run tests/server-*` xanh. Thử `PORT=8787 npx tsx server/index.ts` bằng curl. Báo cáo ngắn (kèm lệnh chạy, biến môi trường).
