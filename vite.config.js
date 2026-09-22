import { defineConfig } from 'vite';

// Static-HTML-first project: `vite build` just bundles/minifies the same
// ES module source that already runs unmodified by opening index.html
// directly (double-click / any static file server) — no build step is
// required to use the app, only to optimize/ship it.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 5173,
    open: true
  }
});
