import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  // REPLACE WITH YOUR ACTUAL REIGENT SECRET KEY
  const HARDCODED_SECRET = 'your_secret_key_here'; // Replace with your actual secret key from Reigent platform
  
  // Only include Authorization header if we have a valid API key
  const proxyHeaders: Record<string, string> = {};
  if (HARDCODED_SECRET && HARDCODED_SECRET !== 'your_secret_key_here') {
    proxyHeaders['Authorization'] = `Bearer ${HARDCODED_SECRET}`;
  }
  
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
          headers: proxyHeaders,
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('Proxy error:', err.message);
              if (!res.headersSent) {
                res.writeHead(500, {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                  error: 'Proxy connection failed',
                  message: 'Please check your API key configuration',
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