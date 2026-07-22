import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const HeroSection = () => {
  const highlights = [
    '500+ specialist doctors',
    'Same-day appointments',
    'Affordable care plans',
  ];

  const trustPoints = [
    { label: 'Verified specialists', value: '98%' },
    { label: 'Patient satisfaction', value: '4.9/5' },
    { label: 'Coverage options', value: '50+' },
    { label: 'Appointments booked', value: '1000+' },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(147,197,253,0.2),_transparent_30%),linear-gradient(135deg,_#0f172a_0%,_#1d4ed8_42%,_#38bdf8_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.28),transparent_40%,rgba(255,255,255,0.12)_70%,transparent)]" />
      <div className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="container-custom relative py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <div className="soft-chip w-fit">
              <span className="text-base">🏥</span>
              Trusted healthcare platform for modern clinics
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Feel confident about your care, every step of the way.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-100 sm:text-xl">
              Discover highly rated specialists, book appointments in minutes, and experience a smoother, more personal healthcare journey.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/doctors">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  Book an Appointment
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                  Explore Services
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span key={item} className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-slate-100 backdrop-blur-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">24/7 patient support</p>
                <p className="text-sm text-slate-600">From booking through follow-up care</p>
              </div>
              <span className="text-2xl">💬</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {trustPoints.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm">
                  <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-4">
              <p className="text-sm font-semibold text-primary-800">Why patients trust us</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><span className="text-primary-600">✓</span> Transparent physician profiles</li>
                <li className="flex items-center gap-2"><span className="text-primary-600">✓</span> Secure digital consultations</li>
                <li className="flex items-center gap-2"><span className="text-primary-600">✓</span> Consistent follow-up support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;