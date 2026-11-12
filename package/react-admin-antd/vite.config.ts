import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    react(),
    tailwindcss(),
    // 拦截 /api 前缀的请求并返回 mock 数据，仅 dev 生效
    mockDevServerPlugin({
      prefix: ['/api'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
