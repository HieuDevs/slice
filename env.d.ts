/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?: {
      id: number;
      username: string;
      role: "admin" | "user";
    };
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_DEFAULT_LANG?: string;
  readonly TURSO_DATABASE_URL: string;
  readonly TURSO_AUTH_TOKEN: string;
  readonly JWT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

