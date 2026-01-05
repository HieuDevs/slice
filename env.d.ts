/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_DEFAULT_LANG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

