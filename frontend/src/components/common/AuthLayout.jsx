import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { HeartPulse, ArrowLeft } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="mb-5 inline-flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-lg shadow-primary-500/25">
              <HeartPulse className="h-6 w-6" strokeWidth={2.4} />
            </span>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Clinic<span className="text-primary-600 dark:text-primary-400">MS</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Sign in to manage your appointments.</p>
        </div>

        <div className="card card--flat p-8">
          <Outlet />
        </div>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </div>
  );
};

export default AuthLayout;
