declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      DEFAULT_PREFIX: string;
      PORT: string;
      HOST: string;
    }
  }
}
