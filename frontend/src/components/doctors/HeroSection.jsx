import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Search,
  ShieldCheck,
  Star,
  Clock,
  Headset,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';
import Button from '../ui/Button';

const highlights = [
  { Icon: BadgeCheck, label: '500+ verified specialists' },
  { Icon: Clock, label: 'Same-day appointments' },
  { Icon: ShieldCheck, label: 'Secure online payments' },
];

const trustPoints = [
  { label: 'Verified doctors', value: '98%', Icon: BadgeCheck },
  { label: 'Patient rating', value: '4.9/5', Icon: Star },
  { label: 'Specialties', value: '50+', Icon: ShieldCheck },
  { label: 'Appointments', value: '10k+', Icon: CalendarCheck },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,_#0b1220_0%,_#1d4ed8_48%,_#2563eb_100%)]">
      {/* Ambient graphics */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl" />

      <div className="container-custom relative py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Now serving patients in Kathmandu
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Quality healthcare,
              <span className="block bg-gradient-to-r from-sky-300 to-amber-300 bg-clip-text text-transparent">
                booked in under a minute.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200 sm:text-xl">
              Connect with highly rated specialists, reserve an appointment instantly, and track your live
              queue token — no phone queues, no waiting-room guesswork.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/doctors">
                <Button variant="white" size="lg" className="w-full sm:w-auto" icon={<CalendarCheck className="h-5 w-5" />}>
                  Book an appointment
                </Button>
              </Link>
              <Link to="/services">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                  icon={<Search className="h-5 w-5" />}
                >
                  Explore services
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5">
              {highlights.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-slate-200">
                  <Icon className="h-4 w-4 text-emerald-300" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Trust panel */}
          <div className="rounded-[28px] border border-white/20 bg-white/95 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl dark:bg-slate-900/90">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
                  <Headset className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">24/7 patient support</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">From booking to follow-up care</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {trustPoints.map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-primary-100 bg-primary-50 p-4 dark:border-primary-900/40 dark:bg-primary-900/15">
              <p className="text-sm font-semibold text-primary-800 dark:text-primary-200">Why patients trust us</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {['Transparent physician profiles', 'Secure digital consultations', 'Consistent follow-up support'].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <Link
                to="/doctors"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-300"
              >
                Meet our doctors <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
