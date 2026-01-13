/**
 * Vite build configuration for the frontend application.
 * Configures React plugin, path aliases, and development server settings.
 * Note: HMR is disabled in production mode, and the server runs on port 3000 with strict port enforcement.
 */
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    }
  },
  server: {
    fs: {
      // eslint-disable-next-line no-undef
      allow: [searchForWorkspaceRoot(process.cwd())],
    },
    hmr:
      mode === 'development'
        ? {
            clientPort: 3000,
            overlay: false,
          }
        : false,
    host: true,
    port: 3000,
    strictPort: true,
  },

}));
