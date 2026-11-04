/**
 * Điểm vào máy chủ: `npm start` (tsx server/index.ts).
 * Biến môi trường: PORT|API_PORT (8787), HOST, DATA_DIR, DIST_DIR, TRUST_PROXY (số tầng proxy), ADMIN_TOKEN,
 * CORS_ORIGIN, COOKIE_SECURE=1, WS_MAX_PER_IP.
 */
import { startServer } from './app';

const running = await startServer();
console.log(`[chùa] máy chủ đang chạy tại http://localhost:${running.port} (dữ liệu: ${running.opts.dataDir})`);

let shuttingDown = false;
async function shutdown(sig: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[chùa] nhận ${sig}, đang tắt êm...`);
  const t = setTimeout(() => process.exit(1), 5000);
  t.unref?.();
  try { await running.close(); } catch (e) { console.error(e); }
  process.exit(0);
}
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('uncaughtException', (e) => { console.error('[chùa] lỗi chưa bắt:', e); });
process.on('unhandledRejection', (e) => { console.error('[chùa] promise bị từ chối:', e); });
