import dotenv from "dotenv";

dotenv.config();

export const resendApiKey = process.env.RESEND_API_KEY || '';

const resendKeyFromEnv = process.env.RESEND_API_KEY;
const emailFromEnvRaw = process.env.EMAIL_FROM || process.env.EMAIL_FROM_ADDR;
if (resendKeyFromEnv && !emailFromEnvRaw && process.env.NODE_ENV !== 'development') {
  console.warn('='.repeat(72));
  console.warn('🚨 EMAIL CONFIG WARNING: RESEND_API_KEY is set but EMAIL_FROM is not!');
  console.warn('   Emails will 400 in production until you set EMAIL_FROM to a');
  console.warn('   Resend-verified sender (e.g. EMAIL_FROM="Clinic <noreply@yourdomain>").');
  console.warn('   Falling back to hardcoded default sender.');
  console.warn('='.repeat(72));
}

const resolveEmailFrom = () => {
  const envVal = process.env.EMAIL_FROM;
  if (envVal && envVal.trim()) return envVal;
  const addrVal = process.env.EMAIL_FROM_ADDR;
  if (addrVal && addrVal.trim()) {
    return `BishwasSetu <${addrVal.trim()}>`;
  }
  return 'BishwasSetu <noreply@bishwassetu.health>';
};

const resolveSmtpPort = () => {
  const v = process.env.SMTP_PORT;
  if (v === undefined || v === null || v === '') return 587;
  const n = Number(v);
  return isNaN(n) ? 587 : n;
};

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  DATABASE_URL: process.env.DATABASE_URL,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  COOKIE_SECURE: process.env.COOKIE_SECURE === "true",
  COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE || "lax",
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  FRONTEND_DIST: process.env.FRONTEND_DIST || undefined,
  RESET_PASSWORD_URL:
    process.env.RESET_PASSWORD_URL ||
    "http://localhost:3000/reset-password",

  EMAIL_FROM: resolveEmailFrom(),

  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || "resend",
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID || undefined,

  EMAIL_SOFT_FAIL: process.env.EMAIL_SOFT_FAIL !== 'false',

  SMTP_HOST: process.env.SMTP_HOST || undefined,
  SMTP_PORT: resolveSmtpPort(),
  SMTP_USER: process.env.SMTP_USER || undefined,
  SMTP_PASS: process.env.SMTP_PASS || undefined,
  SMTP_SECURE: process.env.SMTP_SECURE || undefined,
  SMTP_FROM: process.env.SMTP_FROM || process.env.EMAIL_FROM || resolveEmailFrom(),

  OTP_EXPIRY_MINUTES:
    parseInt(process.env.OTP_EXPIRY_MINUTES) || 10,

  OTP_LENGTH:
    parseInt(process.env.OTP_LENGTH) || 6,

  OTP_MAX_ATTEMPTS: parseInt(process.env.OTP_MAX_ATTEMPTS) || 5,
  OTP_LOCKOUT_MINUTES: parseInt(process.env.OTP_LOCKOUT_MINUTES) || 15,

  OTP_RATE_LIMIT_WINDOW:
    parseInt(process.env.OTP_RATE_LIMIT_WINDOW) || 900000,

  OTP_RATE_LIMIT_MAX:
    parseInt(process.env.OTP_RATE_LIMIT_MAX) || 5,

  RESEND_OTP_RATE_LIMIT_WINDOW:
    parseInt(process.env.RESEND_OTP_RATE_LIMIT_WINDOW) || 900000,

  RESEND_OTP_RATE_LIMIT_MAX:
    parseInt(process.env.RESEND_OTP_RATE_LIMIT_MAX) || 3,
  Cloud_Name: process.env.CLOUDINARY_CLOUD_NAME || process.env.Cloud_Name,
  Cloud_API_SECRET: process.env.CLOUDINARY_API_SECRET || process.env.Cloud_API_SECRET,
  Cloud_API_KEY: process.env.CLOUDINARY_API_KEY || process.env.Cloud_API_KEY,

  KHALTI_SECRET_KEY: process.env.KHALTI_SECRET_KEY,
  KHALTI_RETURN_URL: process.env.KHALTI_RETURN_URL,
  KHALTI_WEBSITE_URL: process.env.KHALTI_WEBSITE_URL,
 
  KHALTI_ENVIRONMENT: process.env.KHALTI_ENVIRONMENT || process.env.KHALTI_ENV || (process.env.NODE_ENV === 'production' ? 'production' : 'test'),
  KHALTI_REQUEST_TIMEOUT: parseInt(process.env.KHALTI_REQUEST_TIMEOUT) || 15000,
  KHALTI_MAX_RETRIES: parseInt(process.env.KHALTI_MAX_RETRIES) || 3,
  KHALTI_RETRY_DELAY_MS: parseInt(process.env.KHALTI_RETRY_DELAY_MS) || 1000,

  SOCKET_CORS_ORIGIN: process.env.SOCKET_CORS_ORIGIN,
  SOCKET_HEARTBEAT_INTERVAL: parseInt(process.env.SOCKET_HEARTBEAT_INTERVAL) || 25000,
  SOCKET_HEARTBEAT_TIMEOUT: parseInt(process.env.SOCKET_HEARTBEAT_TIMEOUT) || 20000,
  SOCKET_MAX_CONNECTIONS_PER_USER: parseInt(process.env.SOCKET_MAX_CONNECTIONS_PER_USER) || 5,

  ESEWA_SECRET_KEY: process.env.ESEWA_SECRET_KEY,
  ESEWA_PRODUCT_CODE: process.env.ESEWA_PRODUCT_CODE,
  ESEWA_SUCCESS_URL: process.env.ESEWA_SUCCESS_URL,
  ESEWA_FAILURE_URL: process.env.ESEWA_FAILURE_URL || process.env.ESWA_FAILURE_URL,
  ESEWA_ENVIRONMENT: (process.env.ESEWA_ENVIRONMENT || process.env.ESEWA_ENV || 'development').toLowerCase() === 'production'
    ? 'production'
    : 'development',

};
