/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="vite-plugin-vue-layouts-next/client" />

interface ImportMetaEnv {
  readonly VITE_NEST_APP_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
