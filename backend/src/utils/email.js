import { ENV } from '../config/env.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const RESEND_API = 'https://api.resend.com/emails';

let ResendSDK = null;
try {
  ResendSDK = require('resend').Resend;
} catch {
  ResendSDK = null;
}

const apiKeyMissing = !ENV.RESEND_API_KEY;

let resendClient = null;
if (ResendSDK && !apiKeyMissing) {
  try {
    resendClient = new ResendSDK(ENV.RESEND_API_KEY);
  } catch (err) {
    console.warn('[email] Resend SDK init failed, will use direct HTTP fallback:', err.message);
    resendClient = null;
  }
}

const sanitizeTo = (to) => {
  if (Array.isArray(to)) return to;
  if (typeof to === 'string') return to.split(',').map((e) => e.trim()).filter(Boolean);
  return [];
};

const buildFrom = () => ENV.EMAIL_FROM;

const sendViaResendHttp = async (payload) => {
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ENV.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || (data && data.error)) {
    const msg = data?.message || data?.error?.message || `HTTP ${res.status}`;
    throw new Error(`Resend HTTP ${res.status}: ${msg}`);
  }
  return { provider: 'resend:http', id: data?.id || null };
};

const sendViaResendSdk = async (payload) => {
  if (!resendClient) return sendViaResendHttp(payload);
  const { data, error } = await resendClient.emails.send(payload);
  if (error) throw new Error(`Resend SDK: ${error.message || JSON.stringify(error)}`);
  return { provider: 'resend:sdk', id: data?.id || null };
};

export const sendEmail = async ({ to, subject, html, text, replyTo, tags }) => {
  const recipients = sanitizeTo(to);
  if (!recipients.length) throw new Error('No recipients provided');
  if (!subject) throw new Error('Email subject is required');
  if (!html && !text) throw new Error('Email html or text body is required');

  const payload = {
    from: buildFrom(),
    to: recipients,
    subject,
    html: html || undefined,
    text: text || (html ? html.replace(/<[^>]*>/g, ' ') : undefined),
  };
  if (replyTo) payload.reply_to = replyTo;
  if (tags && tags.length) payload.tags = tags;
  if (ENV.RESEND_AUDIENCE_ID) payload.audience_id = ENV.RESEND_AUDIENCE_ID;

  if (apiKeyMissing) {
    const devPreview = (payload.text || '').slice(0, 320);
    if (ENV.NODE_ENV === 'development') {
      console.log(`[email-dev] Resend key missing → preview to=${recipients.join(',')} subj=${subject}\n${devPreview}`);
      return { success: false, skipped: true, reason: 'RESEND_API_KEY missing; logged preview in dev.' };
    }
    throw new Error('RESEND_API_KEY is not configured. Check backend/.env');
  }

  let result;
  try {
    result = await sendViaResendSdk(payload);
  } catch (sdkErr) {
    if (resendClient) {
      console.warn('[email] Resend SDK failed, retrying via direct HTTP:', sdkErr.message);
    }
    result = await sendViaResendHttp(payload);
  }

  console.log(`✅ [email] sent via ${result.provider}: ${subject} → ${recipients.join(', ')}`);
  return { success: true, ...result };
};

// ==================== BRANDED TEMPLATE HELPERS ====================

const baseLayout = ({ accent = '#0F766E', title, headline, body, cta, ctaUrl, preview }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${preview ? `<meta name="x-apple-news-preview-text" content="${preview.replace(/"/g, "'")}" />` : ''}
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.55; }
    .container { max-width: 600px; margin: 0 auto; padding: 24px 12px; }
    .header { border-radius: 16px 16px 0 0; background: ${accent}; padding: 28px 28px; color: #fff; }
    .header h1 { font-size: 20px; font-weight: 700; letter-spacing: -0.01em; }
    .header p { margin-top: 6px; opacity: 0.92; font-size: 14px; }
    .content { background: #ffffff; padding: 28px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 18px 0; }
    .otp { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: ${accent}; text-align: center; padding: 18px 12px; background: #ffffff; border: 2px dashed #cbd5e1; border-radius: 12px; margin: 16px 0; font-variant-numeric: tabular-nums; }
    .meta { font-size: 12.5px; color: #475569; }
    .btn-wrap { text-align: center; margin: 16px 0; }
    .btn { display: inline-block; background: ${accent}; color: #ffffff; padding: 12px 22px; border-radius: 10px; text-decoration: none; font-weight: 600; }
    .pill { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; color: #fff; background: rgba(255,255,255,0.16); }
    .warn { border-left: 4px solid #f59e0b; background: #fffbeb; color: #78350f; padding: 12px 14px; border-radius: 8px; margin: 16px 0; font-size: 13.5px; }
    .footer { border-radius: 0 0 16px 16px; background: #f8fafc; padding: 18px 28px; border: 1px solid #e2e8f0; border-top: 0; color: #64748b; font-size: 12px; }
    .kv { display: grid; grid-template-columns: max-content 1fr; gap: 6px 14px; font-size: 13.5px; }
    .kv dt { color: #64748b; }
    .kv dd { color: #0f172a; font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p><span class="pill">🏥 BishwasSetu Health</span></p>
      <h1 style="margin-top:10px">${headline}</h1>
      <p>${title}</p>
    </div>
    <div class="content">
      ${body}
      ${cta && ctaUrl ? `<div class="btn-wrap"><a class="btn" href="${ctaUrl}">${cta}</a></div>` : ''}
    </div>
    <div class="footer">
      <p>BishwasSetu · automated message — do not reply.</p>
      <p style="margin-top:6px">&copy; ${new Date().getFullYear()} BishwasSetu Healthcare · ${ENV.FRONTEND_URL || ''}</p>
    </div>
  </div>
</body>
</html>`;

// ==================== TEMPLATES ====================

const tVerification = (name, otp) => baseLayout({
  accent: '#0284c7',
  title: 'Email verification code',
  headline: 'Verify your email',
  preview: `Your verification code: ${otp}`,
  body: `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thanks for signing up to BishwasSetu! Use the one-time code below to confirm your email address and activate your account.</p>
    <div class="otp">${otp}</div>
    <dl class="kv card">
      <dt>Expires in</dt><dd>${ENV.OTP_EXPIRY_MINUTES} minutes</dd>
      <dt>Single use</dt><dd>This code works exactly once</dd>
    </dl>
    <p class="meta">If you didn't create this account, you can safely ignore this email.</p>
  `,
});

const tPasswordReset = (name, otp) => baseLayout({
  accent: '#dc2626',
  title: 'Password reset code',
  headline: 'Reset your password',
  preview: `Your password reset code: ${otp}`,
  body: `
    <p>Hello <strong>${name}</strong>,</p>
    <p>We received a request to reset your password. Enter the code below in the password-reset form:</p>
    <div class="otp">${otp}</div>
    <dl class="kv card">
      <dt>Expires in</dt><dd>${ENV.OTP_EXPIRY_MINUTES} minutes</dd>
      <dt>Single use</dt><dd>Immediately invalidated after use</dd>
    </dl>
    <div class="warn"><strong>Security notice:</strong> Never share this code with anyone. BishwasSetu staff will never ask for it. If you did not request this, ignore this message and keep your account secure.</div>
  `,
});

const tWelcome = (name, role) => baseLayout({
  accent: '#0d9488',
  title: `Welcome aboard, ${role}`,
  headline: 'Your account is ready!',
  preview: `Welcome ${name}! Start using BishwasSetu.`,
  body: `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Your <span class="pill" style="background:rgba(13,148,136,0.1); color:#0f766e">${role}</span> account has been successfully created and verified. Here's what you can do next:</p>
    <div class="card">
      <ul style="padding-left:18px; margin:0; font-size:14px; color:#334155;">
        <li style="margin:6px 0">📅 Book and manage appointments online</li>
        <li style="margin:6px 0">📋 Access medical records and prescriptions</li>
        <li style="margin:6px 0">💬 Message your care team securely</li>
        <li style="margin:6px 0">💳 Pay bills through eSewa or Khalti</li>
      </ul>
    </div>
    <p>Have questions? Reach out to BishwasSetu support anytime.</p>
  `,
  cta: 'Sign in to dashboard',
  ctaUrl: `${ENV.FRONTEND_URL || ''}/login`,
});

const NOTIFICATION_META = {
  APPOINTMENT: { accent: '#0ea5e9', icon: '📅', label: 'Appointment' },
  PATIENT:     { accent: '#8b5cf6', icon: '👤', label: 'Patient' },
  PAYMENT:     { accent: '#10b981', icon: '💳', label: 'Payment' },
  ALERT:       { accent: '#ef4444', icon: '🚨', label: 'Alert' },
  INFO:        { accent: '#64748b', icon: 'ℹ️', label: 'Update' },
};

const tNotification = ({ name, title, message, type, link }) => {
  const meta = NOTIFICATION_META[type] || NOTIFICATION_META.INFO;
  const pillStyle = `background:${meta.accent}14; color:${meta.accent}`;
  return baseLayout({
    accent: meta.accent,
    title: `${meta.label} notification`,
    headline: title,
    preview: message,
    body: `
      <p>Hello <strong>${name}</strong>,</p>
      <div class="card">
        <p style="margin-bottom:8px"><span class="pill" style="${pillStyle}">${meta.icon} ${meta.label}</span></p>
        <p style="color:#0f172a">${message}</p>
      </div>
    `,
    cta: link ? 'View details' : null,
    ctaUrl: link ? (link.startsWith('http') ? link : `${ENV.FRONTEND_URL || ''}${link}`) : null,
  });
};

// ==================== PUBLIC SENDERS ====================

const defaultReplyTo = () => {
  const m = ENV.EMAIL_FROM.match(/<([^>]+)>/);
  return m ? m[1] : ENV.EMAIL_FROM;
};

export const sendVerificationEmail = async (email, otp, name) => {
  return sendEmail({
    to: email,
    subject: 'Verify your email · BishwasSetu',
    html: tVerification(name || email.split('@')[0], otp),
    replyTo: defaultReplyTo(),
    tags: [{ name: 'category', value: 'verification' }],
  });
};

export const sendPasswordResetEmail = async (email, otp, name) => {
  return sendEmail({
    to: email,
    subject: 'Password reset code · BishwasSetu',
    html: tPasswordReset(name || email.split('@')[0], otp),
    replyTo: defaultReplyTo(),
    tags: [{ name: 'category', value: 'password_reset' }],
  });
};

export const sendWelcomeEmail = async (email, name, role = 'Patient') => {
  return sendEmail({
    to: email,
    subject: `Welcome to BishwasSetu, ${role}!`,
    html: tWelcome(name || email.split('@')[0], role),
    replyTo: defaultReplyTo(),
    tags: [{ name: 'category', value: 'welcome' }],
  });
};

export const sendNotificationEmail = async ({ email, name, notification }) => {
  if (!email) return { success: false, skipped: true, reason: 'No recipient email' };
  return sendEmail({
    to: email,
    subject: `${notification.title || 'New update'} · BishwasSetu`,
    html: tNotification({
      name: name || email.split('@')[0],
      title: notification.title,
      message: notification.message,
      type: notification.type,
      link: notification.link,
    }),
    replyTo: defaultReplyTo(),
    tags: [{ name: 'category', value: `notification_${(notification.type || 'INFO').toLowerCase()}` }],
  });
};
