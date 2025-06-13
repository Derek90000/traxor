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
        rewrite: (path) => path.replace(/^\/rei/, '/rei'),
        headers: {
          'Authorization': `Bearer ${process.env.VITE_REI_API_KEY || 'pk_rei_68435a522450b95277f1cfc9.147a8f17223f17c9a8091722a028177383c0ea4640b5e827e2a073ed7c72194e.1a18eb03f8c1d8849269f08de5b73d41703d714dbc421d3315f4932795636ee0'}`
        }
      }
    }
  }
});