import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import terminalFrames from './src/plugins/terminal.mjs';
import { unified } from '@astrojs/markdown-remark';
export default defineConfig({ integrations: [react()], vite: { plugins: [tailwindcss()] }, markdown: { processor: unified({ rehypePlugins: [terminalFrames] }), shikiConfig: { theme: 'github-dark' } } });
