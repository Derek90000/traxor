import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  // HARDCODED SECRET KEY FOR TESTING - Replace with your actual key
  const HARDCODED_SECRET = 'f37b4018b61af7f466844eb436cc378c842ebcfa45aecd21f49c434f0fd2442a'; // Your actual secret key
  
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