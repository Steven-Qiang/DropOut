import { defineConfig } from 'vite';
import { resolve } from 'path';
import sassGlobImports from 'vite-plugin-sass-glob-import';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: './',
  plugins: [sassGlobImports()],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import'],
      },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
    target: 'es2015',
    minify: 'terser',
    assetsDir: 'assets',
    copyPublicDir: true,
  },
  server: {
    port: 8080,
    open: true,
    host: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@images': resolve(__dirname, 'src/assets/images'),
    },
  },
});
