import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({ open: false })],
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@components': path.resolve(__dirname, './src/common/components'),
      '@utils': path.resolve(__dirname, './src/common/utils'),
      '@hooks': path.resolve(__dirname, './src/common/hooks'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          yupResolver: ['@hookform/resolvers/yup'],
          isValidPhoneNumber: ['libphonenumber-js/min'],
        },
      },
    },
    sourcemap: false,
    chunkSizeWarningLimit: 500,
  },
});
