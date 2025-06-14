import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/reigent': {
          target: 'https://api.reisearch.box',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/reigent/, ''),
          // No hardcoded headers - let axios handle authentication
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('Proxy error:', err.message);
              if (!res.headersSent) {
                res.writeHead(500, {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                  error: 'Proxy connection failed',
                  message: 'Check API key configuration',
                  usingMocks: true
                }));
              }
            });
          }
        }
      }
    }
  };
});