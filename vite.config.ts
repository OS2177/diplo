// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ✅ Allows @/components/... usage
    },
  },
  server: {
    host: '0.0.0.0',          // ✅ Needed for Replit routing
    port: 5173,               // ✅ Lock dev server port
    strictPort: true,         // ✅ Don't randomly change ports
    watch: {
      usePolling: true,       // ✅ Stable file watching in Replit
    },
    hmr: {
      clientPort: 443,        // ✅ Secure HMR over HTTPS
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'diplo-jackvintage77.replit.app',
      '571769ad-7014-4e96-b40c-d6039ffefe07-00-3nyw07towzbqe.picard.replit.dev'
    ],
  },
});
