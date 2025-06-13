import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/rei': {
        target: 'https://api.reisearch.box',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rei/, ''),
        headers: {
          'Authorization': `Bearer ${process.env.VITE_REI_API_KEY}`
        }
      }
    }
  }
});