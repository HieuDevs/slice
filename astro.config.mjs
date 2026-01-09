// @ts-check
import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';


// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    mdx(),
    sitemap(),
    icon(),
  ],

  server: {
    port: 3000,
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url),
      },
    },
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
      PUBLIC_DEFAULT_LANG: envField.string({
        context: 'client',
        access: 'public',
        default: 'vi',
      }),
      TURSO_DATABASE_URL: envField.string({
        context: 'server',
        access: 'secret',
      }),
      TURSO_AUTH_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      JWT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
  },
});