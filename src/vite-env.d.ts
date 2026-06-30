/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_USE_MOCK_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
