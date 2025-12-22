import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost',
    proxy: {
      // Admin client (served under /admin)
      '/admin': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
        // Do not rewrite so client routes remain /admin/*
      },
      // Student client (served under /student)
      '/student': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      // Admin API under unified origin
      '/admin/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/admin/, ''),
      },
      // Student API under unified origin
      '/student/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/student/, ''),
      },
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
