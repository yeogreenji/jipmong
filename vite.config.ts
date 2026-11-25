import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5184, host: true },
  preview: { port: 4184, host: true },
  build: {
    rollupOptions: {
      output: {
        // 화면 코드와 라이브러리를 나눠 첫 로딩과 캐시를 개선합니다.
        manualChunks: {
          react: ['react', 'react-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
