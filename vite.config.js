import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    origin: 'http://localhost:5173',
    hmr: {
      clientPort: 5173,
    },
    fs: {
      allow: ['..'],
    },
    middlewareMode: false,
    historyApiFallback: true,
  },
});
