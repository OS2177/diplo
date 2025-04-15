
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: false,
    hmr: {
      clientPort: 443,
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '571769ad-7014-4e96-b40c-d6039ffefe07-00-3nyw07towzbqe.picard.replit.dev',
    ],
  },
});
