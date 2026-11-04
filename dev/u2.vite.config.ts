// Cấu hình Vite riêng cho harness U2: thay @/content/kinh bằng bản giả khi bản thật chưa đủ export.
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../src', import.meta.url));
const mock = fileURLToPath(new URL('./u2-kinh-mock.ts', import.meta.url));
export default defineConfig({
  root: fileURLToPath(new URL('..', import.meta.url)),
  resolve: { alias: [{ find: '@/content/kinh', replacement: mock }, { find: '@', replacement: src }] },
  server: { host: true, port: 5204 },
});
