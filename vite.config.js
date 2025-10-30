import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      tailwindcss(),
      viteStaticCopy({
        targets: [
          {
            src: 'src/assets/images/*',
            dest: 'assets/images'
          },
          {
            src: 'src/assets/videos/*',
            dest: 'assets/videos'
          }
        ]
      })
    ],
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

