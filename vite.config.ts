import { defineConfig } from 'vite';

export default defineConfig({
  // PHP y Node conservan el documento y sus rutas; Vite compila solo el hero.
  publicDir: false,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'public',
    emptyOutDir: false,
    target: 'es2020',
    cssCodeSplit: false,
    lib: {
      entry: 'src/hero/main.tsx',
      name: 'RumboHero',
      formats: ['iife'],
      fileName: () => 'hero.js',
      cssFileName: 'hero',
    },
  },
});
