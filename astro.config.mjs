import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import terminalFrames from './src/plugins/terminal.mjs';
import { unified } from '@astrojs/markdown-remark';
import { lineHighlight } from './src/plugins/line-highlight.mjs';
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    processor: unified({ rehypePlugins: [terminalFrames] }),
    shikiConfig: { theme: 'github-dark', transformers: [lineHighlight] },
  },
});
