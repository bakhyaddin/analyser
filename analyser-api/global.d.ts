export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      API_PORT: string;
      CORS_ALLOWED_ORIGINS: string;
      POSTGRES_HOST: string;
      POSTGRES_PORT: string;
      POSTGRES_DB: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      DB_LOGGING: string;
      S3_BUCKET_REGION: string;
      S3_BUCKET_NAME: string;
    }
  }
}
