import dotenv from 'dotenv';

interface ProxyConfig {
  PROXY_PORT: string;
  PROXY_TARGET_HOSTNAME: string;
  COOKIE_SECRET_KEYS: string;
  OSS_KEY: string;
  OSS_SECRET: string;
  SMS_KEY: string;
  SMS_SECRET: string;
  MAIL_PASSWORD: string;
  FIREBASE_SERVER_KEY: string;
  FCM_APPLICATION_PRIVATE_KEY: string;
  FCM_APPLICATION_PUBLIC_KEY: string;
}

let {parsed, error} = dotenv.config();

if (error || !parsed) {
  throw error || new Error('.env parse error');
}

export const config = (parsed as unknown) as ProxyConfig;
