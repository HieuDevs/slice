// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [mdx(), sitemap()],

  server: {
    port: 3000,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: 'vi',
    locales: ['en', 'vi'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  env: {
    schema: {
      PUBLIC_DEFAULT_LANG: {
        context: 'client',
        type: 'string',
        default: 'vi',
        access: 'public',
      },
    },
  },
});