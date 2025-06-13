import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Only include Authorization header if API key is provided
  const proxyHeaders: Record<string, string> = {};
  if (env.VITE_REI_API_KEY) {
    proxyHeaders['Authorization'] = `Bearer ${env.VITE_REI_API_KEY}`;
  }
  
  return {
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
          headers: proxyHeaders
        }
      }
    }
  };
});