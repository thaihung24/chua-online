// Cấu hình Vite riêng cho harness W2: nếu chưa có src/world/environment.ts (W1) hoặc đặt W2_STUB=1 thì dùng dev/env-stub.ts.
import { defineConfig, type Plugin } from 'vite';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const realEnv = resolve(root, 'src/world/environment.ts');
const stub = resolve(root, 'dev/env-stub.ts');

const envFallback: Plugin = {
  name: 'w2-env-fallback',
  enforce: 'pre',
  resolveId(source, importer) {
    if (!importer || !/\/src\/world\/index\.ts$/.test(importer.replace(/\\/g, '/'))) return null;
    if (source !== './environment') return null;
    if (process.env.W2_STUB === '1' || !existsSync(realEnv)) return stub;
    return null;
  },
};

export default defineConfig({
  root,
  plugins: [envFallback],
  resolve: { alias: { '@': resolve(root, 'src') } },
  server: { host: true, port: 5202, strictPort: true, hmr: false },
  optimizeDeps: { entries: ['dev/w2.html'] },
});
