import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isGitHubPagesBuild = process.env.DEPLOY_TARGET === 'github-pages';

export default defineConfig({
  base: isGitHubPagesBuild ? '/pixel-grid-app/' : '/',
  plugins: [react()],
});
