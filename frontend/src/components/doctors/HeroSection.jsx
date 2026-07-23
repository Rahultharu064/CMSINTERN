import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarPlus,
  Search,
  ShieldCheck,
  Clock,
  Star,
  Users,
  HeartPulse,
  MessageCircle,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';
import Button from '../ui/Button';

const highlights = [
  { icon: BadgeCheck, label: '500+ verified specialists' },
  { icon: Clock, label: 'Same-day appointments' },
  { icon: ShieldCheck, label: 'Secure online payments' },
];

const trustPoints = [
  { icon: BadgeCheck, label: 'Verified specialists', value: '98%' },
  { icon: Star, label: 'Patient satisfaction', value: '4.9/5' },
  { icon: HeartPulse, label: 'Specialties', value: '50+' },
  { icon: Users, label: 'Appointments booked', value: '10K+' },
];

const HeroSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,_#022c22_0%,_#0f766e_48%,_#0d9488_100%)]">
      {/* Ambient decorations */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="container-custom relative py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-teal-50 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Now serving patients in Chabahil, Kathmandu
            </span>

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Compassionate care,
              <br />
              <span className="text-amber-300">instantly booked.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-teal-50/90">
              Book an appointment online in under a minute. Skip long phone queues and crowded waiting rooms — with live
              queue tokens and instant confirmations.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/doctors">
                <Button variant="accent" size="lg" icon={<CalendarPlus className="h-5 w-5" />} className="w-full sm:w-auto">
                  Book Appointment
                </Button>
              </Link>
              <Link to="/doctors">
                <Button
                  size="lg"
                  icon={<Search className="h-5 w-5" />}
                  className="w-full border border-white/20 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                >
                  Find a Doctor
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5">
              {highlights.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-teal-50/90">
                  <Icon className="h-4 w-4 text-emerald-300" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Trust card */}
          <div className="rounded-[28px] border border-white/20 bg-white/95 p-6 shadow-[0_30px_80px_rgba(2,20,15,0.35)] backdrop-blur-xl dark:bg-slate-900/95">
            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary-50 to-teal-50 px-4 py-3.5 dark:from-slate-800 dark:to-slate-800/60">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">24/7 patient support</p>
                <p className="text-xs text-slate-500">From booking through follow-up care</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-500/30">
                <MessageCircle className="h-5 w-5" />
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {trustPoints.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <p className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            <Link
              to="/doctors"
              className="mt-5 flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3.5 text-white transition-colors hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-700"
            >
              <span className="text-sm font-semibold">Browse all doctors</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Soft bottom fade into page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[var(--app-bg)]" />
    </section>
  );
};

export default HeroSection;
