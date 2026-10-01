import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, MailCheck, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/authHooks.js';
import { resendVerificationEmail, verifyEmail, clearError } from '../Redux/slices/authSlice.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';

const VerifyEmail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, debugOtp, emailSendFailed } = useAppSelector((state) => state.auth);
  const email =
    location.state?.email ||
    localStorage.getItem('pending_verification_email') ||
    useAppSelector((state) => state.auth.pendingEmail) ||
    '';

  const [otp, setOtp] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearError()), 6000);
      return () => clearTimeout(t);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  useEffect(() => {
    if (debugOtp) {
      localStorage.setItem('debug_verify_otp', String(debugOtp));
    }
  }, [debugOtp]);

  const persistentDebugOtp = debugOtp || localStorage.getItem('debug_verify_otp') || null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setFieldError('Enter the 6-digit code sent to your email.');
      return;
    }
    setFieldError('');
    const result = await dispatch(verifyEmail({ email, otp }));
    if (verifyEmail.fulfilled.match(result)) {
      localStorage.removeItem('pending_verification_email');
      localStorage.removeItem('debug_verify_otp');
      navigate('/login', { replace: true, state: { verifiedEmail: email } });
    }
  };

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;
    const result = await dispatch(resendVerificationEmail(email));
    if (resendVerificationEmail.fulfilled.match(result)) {
      setResendCooldown(60);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
          <MailCheck size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Verify your email</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Enter the 6-digit code sent to {email || 'your email address'}.
        </p>
      </div>

      {!email && (
        <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Your verification email is missing. Please register again.</span>
        </p>
      )}

      {persistentDebugOtp && (
        <div className={`mb-4 rounded-lg border p-4 flex items-start gap-3 ${
          emailSendFailed
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className={`mt-0.5 p-1.5 rounded-lg ${
            emailSendFailed ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {emailSendFailed ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-sm">
              {emailSendFailed
                ? 'Email could not be delivered — use this code instead'
                : 'Preview code (dev / email failover)'}
            </p>
            <p className="text-xs opacity-80">
              Enter it in the box below instead of waiting for an email.
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 font-mono text-xl font-extrabold tracking-widest shadow-sm">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : persistentDebugOtp.split('').join(' ')}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm text-danger">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Verification code"
          name="otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          icon={<KeyRound size={18} />}
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
          error={Boolean(fieldError)}
          helperText={fieldError}
          disabled={isLoading || !email}
          required
        />
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isLoading}
          disabled={isLoading || !email}
        >
          Verify email
        </Button>
      </form>

      <button
        type="button"
        onClick={handleResend}
        disabled={isLoading || !email || resendCooldown > 0}
        className="mt-4 w-full text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
      >
        {resendCooldown > 0
          ? `Resend available in ${resendCooldown}s`
          : isLoading
          ? 'Sending...'
          : 'Send a new code'}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already verified?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default VerifyEmail;
