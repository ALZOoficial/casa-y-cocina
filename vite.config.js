import { defineConfig } from 'vite';

// BASE_PATH: '/' en Netlify (por defecto) o '/casa-y-cocina/' en GitHub Pages
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  build: { target: 'es2020', assetsInlineLimit: 0, chunkSizeWarningLimit: 700 },
  server: { host: true, port: 5173 },
});
