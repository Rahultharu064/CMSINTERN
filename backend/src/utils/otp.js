import crypto from 'crypto';
import prisma from "../config/database.js";
import { ENV } from "../config/env.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email.js";

const OTP_EXPIRY_MINUTES = ENV.OTP_EXPIRY_MINUTES;
const OTP_RESEND_COOLDOWN_MINUTES = 2;
const OTP_LENGTH = ENV.OTP_LENGTH;
const MAX_ATTEMPTS = ENV.OTP_MAX_ATTEMPTS;
const LOCKOUT_MINUTES = ENV.OTP_LOCKOUT_MINUTES;

const formatOtpType = (type) => (type || 'EMAIL_VERIFICATION').toUpperCase();

const getLockoutUntil = async (email, type) => {
  const lockoutStart = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000);
  const recentFailures = await prisma.oTP.count({
    where: {
      email,
      type,
      createdAt: { gte: lockoutStart },
      AND: [{ failedAttempts: { gt: 0 } }],
    },
  });
  if (recentFailures >= MAX_ATTEMPTS) {
    const nextUnlock = new Date(lockoutStart.getTime() + LOCKOUT_MINUTES * 60 * 1000);
    const secondsLeft = Math.max(0, Math.ceil((nextUnlock.getTime() - Date.now()) / 1000));
    return { locked: true, secondsLeft };
  }
  return { locked: false };
};

const incrementFailedAttempts = async (otpRecord) => {
  try {
    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { failedAttempts: (otpRecord.failedAttempts || 0) + 1 },
    });
  } catch (e) {
    console.warn('otp: could not increment failed attempts:', e.message);
  }
};

const generateOtp = (length = OTP_LENGTH) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
};

const generateOtpExpiry = (minutes = OTP_EXPIRY_MINUTES) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

const isOtpExpired = (expiryDate) => new Date() > new Date(expiryDate);

const prepareNewOtp = async (email, type = "EMAIL_VERIFICATION", userId = null) => {
  const normalizedType = formatOtpType(type);

  const lockout = await getLockoutUntil(email, normalizedType);
  if (lockout.locked) {
    throw new Error(`Too many failed attempts. Please try again in ${Math.ceil(lockout.secondsLeft / 60)} minute(s).`);
  }

  const existingOTP = await prisma.oTP.findFirst({
    where: {
      email,
      type: normalizedType,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (existingOTP) {
    const cooldownMs = OTP_RESEND_COOLDOWN_MINUTES * 60 * 1000;
    const timeSinceLastOTP = Date.now() - new Date(existingOTP.createdAt).getTime();
    if (timeSinceLastOTP < cooldownMs) {
      const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastOTP) / 1000);
      throw new Error(`Please wait ${remainingSeconds}s before requesting another code.`);
    }
    await prisma.oTP.update({
      where: { id: existingOTP.id },
      data: { isUsed: true },
    });
  }

  const otp = generateOtp(OTP_LENGTH);
  const expiresAt = generateOtpExpiry(OTP_EXPIRY_MINUTES);

  const record = await prisma.oTP.create({
    data: {
      email,
      otp,
      expiresAt,
      type: normalizedType,
      userId: userId || undefined,
      isUsed: false,
      failedAttempts: 0,
    },
  });

  return { otp, record };
};

const dispatchOtpEmail = async (email, otp, type, name) => {
  const normalizedType = formatOtpType(type);
  try {
    if (normalizedType === 'EMAIL_VERIFICATION') {
      await sendVerificationEmail(email, otp, name);
    } else if (normalizedType === 'PASSWORD_RESET') {
      await sendPasswordResetEmail(email, otp, name);
    }
  } catch (error) {
    console.error(`⚠️ otp: failed to dispatch ${normalizedType} email to ${email}:`, error.message);
  }
};

export const sendOtp = async (email, type = "EMAIL_VERIFICATION", userId = null, name) => {
  try {
    const { otp } = await prepareNewOtp(email, type, userId);
    await dispatchOtpEmail(email, otp, type, name);
    return otp;
  } catch (error) {
    console.error('Send OTP Error:', error.message);
    throw error;
  }
};

export const verifyOtp = async (email, otp, type = "EMAIL_VERIFICATION") => {
  try {
    const normalizedType = formatOtpType(type);

    const lockout = await getLockoutUntil(email, normalizedType);
    if (lockout.locked) {
      throw new Error(`Too many failed attempts. Please try again in ${Math.ceil(lockout.secondsLeft / 60)} minute(s).`);
    }

    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email,
        type: normalizedType,
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new Error('Invalid or expired OTP');
    }

    if (isOtpExpired(otpRecord.expiresAt)) {
      await prisma.oTP.update({ where: { id: otpRecord.id }, data: { isUsed: true } });
      throw new Error('OTP has expired');
    }

    if (String(otpRecord.otp) !== String(otp)) {
      await incrementFailedAttempts(otpRecord);
      throw new Error('Invalid OTP');
    }

    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    return {
      success: true,
      message: 'OTP verified successfully',
      userId: otpRecord.userId,
      email: otpRecord.email,
    };
  } catch (error) {
    console.error('Verify OTP Error:', error.message);
    throw error;
  }
};

export const resendOtp = async (email, type = "EMAIL_VERIFICATION", userId = null, name) => {
  try {
    const { otp } = await prepareNewOtp(email, type, userId);
    await dispatchOtpEmail(email, otp, type, name);
    return otp;
  } catch (error) {
    console.error('Resend OTP Error:', error.message);
    throw error;
  }
};

export {
  generateOtp,
  generateOtpExpiry,
  isOtpExpired,
};
