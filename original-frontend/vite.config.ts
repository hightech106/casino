/**
 * Vite build configuration for the original frontend application.
 * Configures React plugin with SWC, SVG support, path aliases, and development server settings.
 * Note: Uses SWC for faster compilation and includes workspace root search for monorepo support.
 */
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { fileURLToPath } from 'url';
import { searchForWorkspaceRoot } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: 'named',
        namedExport: 'ReactComponent',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
    },
  },
  envPrefix: 'REACT_APP_',
  build: {
    outDir: 'build',
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'color-functions'],
      },
    },
  },
  server: {
    fs: {
      // eslint-disable-next-line no-undef
      allow: [searchForWorkspaceRoot(process.cwd())],
    },
    hmr:
      mode === 'development'
        ? {
            clientPort: 3001,
            overlay: false,
          }
        : false,
    host: true,
    port: 3001,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
}));
