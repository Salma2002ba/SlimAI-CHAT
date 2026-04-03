import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // GitHub Pages "project" URLs are https://<user>.github.io/<repo>/ — Vite needs matching `base`.
  const rawBase = process.env.VITE_BASE_PATH ?? env.VITE_BASE_PATH ?? '/';
  const base =
    !rawBase || rawBase === '/'
      ? '/'
      : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`;

  return {
    base,
    plugins: [react(), tailwindcss()],
    // VITE_* vars are exposed via import.meta.env; do not embed API keys in the client bundle.
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

