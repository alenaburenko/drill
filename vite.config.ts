import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

/// <reference types="vitest/config" />
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: true,
      watch: {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Monaco editor wrapper
            monaco: ['@monaco-editor/react'],
            // Lucide icons — ~10K after minification
            icons: ['lucide-react'],
            // Motion animation library (~96K)
            motion: ['motion'],
            // Task data — 540+ tasks, 2,438 lines, pure data
            'task-data': ['./src/tasks/itlead.ts'],
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test-setup.ts',
      css: true,
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['node_modules', '.claude'],
    },
  };
});
