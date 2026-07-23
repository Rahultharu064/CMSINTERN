import React from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Building2,
  Wallet,
  MapPin,
  Search,
  CalendarCheck,
  HeartHandshake,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  Users,
  Star,
} from 'lucide-react';
import HeroSection from '../components/doctors/HeroSection.jsx';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const features = [
  { icon: Stethoscope, title: 'Expert doctors', description: 'Board-certified specialists with years of hands-on clinical experience.' },
  { icon: Building2, title: 'Modern facilities', description: 'Contemporary care spaces equipped for advanced diagnostics and comfort.' },
  { icon: Wallet, title: 'Flexible payments', description: 'Simple billing with eSewa, Khalti, and pay-at-clinic options.' },
  { icon: MapPin, title: 'Convenient access', description: 'Easy appointments, fast support, and dependable follow-through.' },
];

const steps = [
  { icon: Search, title: 'Choose your specialist', description: 'Explore verified doctors by specialty, location, and availability.' },
  { icon: CalendarCheck, title: 'Book in minutes', description: 'Pick a time that works for you and confirm your visit instantly.' },
  { icon: HeartHandshake, title: 'Receive attentive care', description: 'Meet your care team with transparent follow-ups and ongoing support.' },
];

const stats = [
  { icon: Stethoscope, value: '500+', label: 'Doctors' },
  { icon: HeartHandshake, value: '50+', label: 'Specialties' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
  { icon: Users, value: '10K+', label: 'Appointments' },
];

const perks = [
  'Transparent physician profiles and treatment guidance.',
  'Flexible telehealth and in-person visits built around your routine.',
  'Dependable follow-up and support from booking through recovery.',
];

const differentiators = [
  '24/7 emergency support and seamless appointment coordination.',
  'Modern telehealth and in-person visits designed for flexibility.',
  'Clear communication, transparent care plans, and dependable follow-up.',
];

const Home = () => {
  return (
    <div>
      <HeroSection />

      <div className="container-custom py-16 lg:py-20">
        {/* Why choose us */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-kicker"><ShieldCheck className="h-4 w-4" /> Why choose us</span>
          <h2 className="section-title">Thoughtful care for every step of your health journey.</h2>
          <p className="section-copy">
            We combine medical excellence with a smooth digital experience so every appointment feels effortless.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{description}</p>
            </Card>
          ))}
        </div>

        {/* How it works + patient-first */}
        <div className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="section-shell p-8 lg:p-10">
            <span className="section-kicker"><CalendarCheck className="h-4 w-4" /> How it works</span>
            <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              A smoother path to better care.
            </h3>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              From booking to follow-up, every step is designed to feel effortless and clear.
            </p>

            <div className="mt-8 space-y-4">
              {steps.map(({ icon: Icon, title, description }, index) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/25">
                    <Icon className="h-5 w-5" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-amber-950">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
                    <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-slate-400">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-shell p-8 lg:p-10">
            <span className="section-kicker"><HeartHandshake className="h-4 w-4" /> Patient-first experience</span>
            <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Care that feels personal, proactive, and reassuring.
            </h3>

            <div className="mt-8 rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50 to-teal-50/60 p-6 dark:border-primary-900/40 dark:from-slate-800/60 dark:to-slate-800/30">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
                What patients love
              </p>
              <ul className="mt-4 space-y-3.5">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-sm leading-6">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <Clock className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="font-display text-lg font-bold text-slate-900 dark:text-white">Same-day</p>
                  <p className="text-xs text-slate-500">appointments</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <ShieldCheck className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="font-display text-lg font-bold text-slate-900 dark:text-white">Secure</p>
                  <p className="text-xs text-slate-500">online payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact + differentiators */}
        <div className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-primary-900 p-8 text-white lg:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary-500/20 blur-3xl" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-primary-300">Our impact</p>
            <h3 className="relative mt-3 font-display text-2xl font-bold">Trusted by patients who expect more.</h3>
            <div className="relative mt-8 grid gap-4 sm:grid-cols-2">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-primary-300" />
                  <div className="mt-3 font-display text-3xl font-bold text-white">{value}</div>
                  <div className="mt-1 text-sm text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-8 lg:p-10">
            <span className="section-kicker"><Star className="h-4 w-4" /> What sets us apart</span>
            <ul className="mt-6 space-y-4">
              {differentiators.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-6">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/doctors">
                <Button variant="primary" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                  Find Your Doctor
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="relative mt-16 overflow-hidden rounded-[32px] bg-gradient-to-r from-primary-700 via-primary-600 to-teal-500 p-8 text-white shadow-xl shadow-primary-900/20 sm:p-12">
          <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-100">Ready to get started?</p>
              <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                Book your visit and experience modern care today.
              </h3>
            </div>
            <Link to="/contact" className="shrink-0">
              <Button variant="accent" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
