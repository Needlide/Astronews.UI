interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly NG_APP_NASA_API_KEY: string;
  [key: string]: string;
}
