import app from './app.js';
import { ENV } from './config/env.js';
import prisma from './config/database.js';
import { createServer } from 'http';
import { initializeSocket } from './config/socket.js';

const REQUIRED_ENV = [
  { key: 'NODE_ENV', required: false, default: 'development' },
  { key: 'PORT', required: false, default: '4000' },
  { key: 'DATABASE_URL', required: true },
  { key: 'JWT_ACCESS_SECRET', required: true },
  { key: 'JWT_REFRESH_SECRET', required: true },
  { key: 'FRONTEND_URL', required: true },
];
const OPTIONAL_BUT_RECOMMENDED_ENV = [
  { key: 'RESEND_API_KEY', hint: 'Needed for sending OTP / password-reset emails from Resend' },
  { key: 'EMAIL_FROM', hint: 'Must be a Resend-verified sender domain for production email delivery' },
  { key: 'SMTP_HOST', hint: 'Optional — SMTP fallback if Resend is not configured' },
  { key: 'Cloud_Name', hint: 'Cloudinary for doctor avatar/certificate uploads' },
  { key: 'Cloud_API_KEY', hint: 'Cloudinary API key' },
  { key: 'Cloud_API_SECRET', hint: 'Cloudinary API secret' },
  { key: 'KHALTI_SECRET_KEY', hint: 'Khalti payment gateway secret' },
  { key: 'ESEWA_SECRET_KEY', hint: 'eSewa payment gateway secret' },
];
function sanityCheckEnv() {
  const missing = REQUIRED_ENV.filter(e => e.required && !process.env[e.key]);
  const weak = REQUIRED_ENV.filter(e => !e.required && !process.env[e.key]);
  if (missing.length || weak.length || OPTIONAL_BUT_RECOMMENDED_ENV.some(e => !process.env[e.key])) {
    console.warn('='.repeat(72));
    console.warn('ENVIRONMENT VALIDATION REPORT');
    console.warn('='.repeat(72));
    if (missing.length) {
      console.warn('🚨 MISSING REQUIRED ENV VARS (features WILL break):');
      missing.forEach(e => console.warn('   ❌ ' + e.key));
    }
    if (weak.length) {
      console.warn('⚠️  MISSING OPTIONAL REQUIRED_ENV DEFAULTS (falling back hardcoded):');
      weak.forEach(e => console.warn('   · ' + e.key + ' → fallback=' + (e.default || 'n/a')));
    }
    const unset = OPTIONAL_BUT_RECOMMENDED_ENV.filter(e => !process.env[e.key]);
    if (unset.length) {
      console.warn('💡 RECOMMENDED ENV VARS NOT SET (features may silently degrade):');
      unset.forEach(e => console.warn('   · ' + e.key + ' — ' + e.hint));
    }
    console.warn('='.repeat(72));
  } else {
    console.log('✅ All required & recommended environment variables are set.');
  }
}
sanityCheckEnv();

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('[DB]: Connected successfully');

    const server = createServer(app);
    initializeSocket(server);

    server.listen(ENV.PORT, () => {
      console.log(`[Server]: Running on port ${ENV.PORT} (${ENV.NODE_ENV})`);
      console.log(`[WebSocket]: Running on localhost:${ENV.PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`\n[${signal}]: Shutting down gracefully...`);
      server.close(async () => {
        try {
          await prisma.$disconnect();
          console.log('[DB]: Disconnected');
          process.exit(0);
        } catch (err) {
          console.error('[Shutdown error]:', err);
          process.exit(1);
        }
      });
      setTimeout(() => {
        console.error('[Shutdown]: Forced exit after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[Server Error]: Port ${ENV.PORT} is already in use`);
      } else {
        console.error('[Server Error]:', err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('[Startup Error]: Failed to start server');
    console.error(err);
    try {
      await prisma.$disconnect();
    } catch (_) { /* ignore */ }
    process.exit(1);
  }
};

startServer();