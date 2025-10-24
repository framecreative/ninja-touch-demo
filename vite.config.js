import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [tailwindcss()],
    build: {
      outDir: 'public/dist',
      emptyOutDir: true,
      manifest: true,
      minify: isProduction ? 'esbuild' : false, // Minify in production
      cssMinify: isProduction, // Minify CSS in production
      rollupOptions: {
        input: {
          main: './src/main.js'
        }
      }
    },
  server: {
    origin: 'http://localhost:5173',
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  }
  };
});

