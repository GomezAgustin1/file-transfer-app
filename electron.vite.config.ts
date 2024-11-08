import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    server: {
      port: 2002,
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    server: {
      port: 2002,
    },
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    server: {
      port: 2002,
    },
    plugins: [react()],
  },
});
