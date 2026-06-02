import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isGitHubPagesBuild = process.env.DEPLOY_TARGET === 'github-pages';
const isDesktopBuild = process.env.BUILD_TARGET === 'desktop';

export default defineConfig({
  base: isDesktopBuild ? './' : isGitHubPagesBuild ? '/pixel-grid-app/' : '/',
  plugins: [react()],
});
