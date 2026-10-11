import { build } from 'vite';
await build({ configFile: false, publicDir: false, build: {
  outDir: 'public', emptyOutDir: false, target: 'es2020',
  lib: { entry: 'src/auth/microsoft.js', name: 'RumboMicrosoft', formats: ['iife'], fileName: () => 'js/cuenta/microsoft-sdk.js' },
} });
