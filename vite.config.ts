import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Check for both possible environment variable names
  const apiKey = env.VITE_REIGENT_SECRET || env.VITE_REI_API_KEY;
  
  // Only include Authorization header if API key is provided
  const proxyHeaders: Record<string, string> = {};
  if (apiKey) {
    proxyHeaders['Authorization'] = `Bearer ${apiKey}`;
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
          headers: proxyHeaders
        }
      }
    }
  };
});