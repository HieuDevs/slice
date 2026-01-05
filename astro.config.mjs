// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), sitemap()],

  server: {
    port: 3000,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: 'en',
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
        default: 'en',
        access: 'public',
      },
    },
  },
});