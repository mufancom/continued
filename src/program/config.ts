import dotenv from 'dotenv';

interface ProxyConfig {
  PROXY_PORT: string;
  PROXY_TARGET_HOSTNAME: string;
  COOKIE_SECRET_KEYS: string;
  OSS_KEY: string;
  OSS_SECRET: string;
  FIREBASE_SERVER_KEY: string;
  FCM_APPLICATION_PRIVATE_KEY: string;
  FCM_APPLICATION_PUBLIC_KEY: string;
}

export const config = dotenv.config() as ProxyConfig;
