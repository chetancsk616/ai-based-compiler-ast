import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/student/',
  server: {
    port: 3002,
    proxy: {
      // When running student standalone, this keeps /student/api working
      '/student/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/student/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
