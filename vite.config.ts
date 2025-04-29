// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/', // <--- ADD THIS
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      clientPort: 443,
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '571769ad-7014-4e96-b40c-d6039ffefe07-00-3nyw07towzbqe.picard.replit.dev',
      'diplo-jackvintage77.replit.app',
    ],
  },
});
