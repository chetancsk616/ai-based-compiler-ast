import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  server: {
    port: 3001,
    proxy: {
      // When running admin standalone, this keeps /admin/api working
      '/admin/api': {
        target: 'http://localhost:4100',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/admin/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
