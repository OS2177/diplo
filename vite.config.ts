import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',              // ✅ required for Replit routing
    port: 5173,                   // ✅ lock the dev port
    strictPort: true,            // ✅ ensures consistency
    watch: {
      usePolling: true,          // ✅ better file change detection in Replit
    },
    hmr: {
      clientPort: 443,           // ✅ required for secure Replit HMR
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '571769ad-7014-4e96-b40c-d6039ffefe07-00-3nyw07towzbqe.picard.replit.dev',
      'diplo-jackvintage77.replit.app',
    ],
  },
});
