import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarPlus,
  Search,
  ShieldCheck,
  Clock,
  Star,
  BadgeCheck,
  Wallet,
  Check,
} from 'lucide-react';
import Button from '../ui/Button';

const highlights = [
  { icon: BadgeCheck, label: '500+ verified specialists' },
  { icon: Clock, label: 'Same-day appointments' },
  { icon: ShieldCheck, label: 'Secure online payments' },
];

const slots = ['10:00 AM', '11:30 AM', '2:00 PM'];

const HeroSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,_#022c22_0%,_#0f766e_50%,_#0d9488_100%)]">
      {/* Ambient decorations */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute -right-20 -top-28 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="container-custom relative py-16 lg:py-24">
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

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              Compassionate care,
              <br />
              <span className="text-amber-300">instantly booked.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-teal-50/90">
              Book an appointment online in under a minute. Skip long phone queues and crowded waiting rooms — with live
              queue tokens and instant confirmations.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/book">
                <Button variant="accent" size="lg" icon={<CalendarPlus className="h-5 w-5" />} className="w-full sm:w-auto">
                  Book Appointment
                </Button>
              </Link>
              <Link to="/book">
                <Button
                  size="lg"
                  icon={<Search className="h-5 w-5" />}
                  className="w-full border border-white/25 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                >
                  Find a Doctor
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex -space-x-3">
                {['#5eead4', '#2dd4bf', '#fcd34d', '#38bdf8'].map((c, i) => (
                  <span
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-teal-800 text-xs font-bold text-teal-950"
                    style={{ background: c }}
                  >
                    {['R', 'S', 'H', 'L'][i]}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-300" />
                  ))}
                </div>
                <p className="mt-0.5 text-sm text-teal-50/90">
                  <span className="font-semibold text-white">10,000+</span> patients treated with care
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
              {highlights.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-teal-50/90">
                  <Icon className="h-4 w-4 text-emerald-300" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Booking preview card */}
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="pointer-events-none absolute -inset-3 rounded-[32px] bg-white/10 blur-2xl" />
            <div className="relative rounded-[28px] border border-white/20 bg-white p-5 shadow-[0_30px_80px_rgba(2,20,15,0.4)] dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Next available</p>
                <span className="badge badge-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online now
                </span>
              </div>

              {/* Doctor row */}
              <div className="mt-4 flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 text-lg font-bold text-white">
                  RS
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900 dark:text-white">Dr. Ram Sharma</p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">Cardiology · 12 yrs</p>
                </div>
                <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold">4.9</span>
                </span>
              </div>

              {/* Slots */}
              <p className="mt-4 text-sm font-medium text-slate-500">Today · Select a time</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {slots.map((s, i) => (
                  <div
                    key={s}
                    className={`rounded-xl border py-2.5 text-center text-sm font-semibold transition-colors ${
                      i === 1
                        ? 'border-primary-500 bg-primary-600 text-white shadow-sm shadow-primary-500/30'
                        : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>

              <Link to="/book" className="btn btn-primary btn-full mt-4">
                <CalendarPlus className="h-4.5 w-4.5" /> Confirm Appointment
              </Link>

              <div className="mt-3.5 flex items-center justify-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-500" /> Instant SMS</span>
                <span className="flex items-center gap-1"><Wallet className="h-3.5 w-3.5 text-primary-500" /> eSewa · Khalti</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
