
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    hmr: {
      protocol: 'wss',
      host: 'diplo-jackvintage77.replit.app',
      clientPort: 443,
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'diplo-jackvintage77.replit.app',
      '571769ad-7014-4e96-b40c-d6039ffefe07-00-3nyw07towzbqe.picard.replit.dev',
    ],
  },
  preview: {
    port: 4173,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'diplo-jackvintage77.replit.app',
      '571769ad-7014-4e96-b40c-d6039ffefe07-00-3nyw07towzbqe.picard.replit.dev',
    ],
  },
});
