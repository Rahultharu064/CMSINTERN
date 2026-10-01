-- Add the counter used by OTP verification lockout logic.
ALTER TABLE `otps`
ADD COLUMN `failedAttempts` INTEGER NOT NULL DEFAULT 0;
