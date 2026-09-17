import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'frontend',
  publicDir: 'public',
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../frontend/dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'frontend/src'),
    },
  },
});
