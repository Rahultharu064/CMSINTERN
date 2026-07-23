import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Check } from 'lucide-react';

/**
 * Alternate compact hero (Link-based). Not used by the Home page — the primary
 * hero lives in components/doctors/HeroSection.jsx — but kept as a valid,
 * self-contained variant that can be dropped in without wiring props.
 */
const HeroSection = () => {
  const credentials = ['No registration fees', 'Direct SMS confirmations', 'Instant live-queue tokens'];

  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(135deg,_#022c22_0%,_#0f766e_48%,_#0d9488_100%)] py-20 text-white lg:py-28"
      id="hero-section"
    >
      <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/20 blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="flex max-w-3xl flex-col gap-6">
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-teal-50">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Now serving patients at Chabahil, Kathmandu
          </span>

          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Compassionate Care,
            <br />
            <span className="text-amber-300">Instantly Booked.</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-teal-50/90 sm:text-xl">
            Book an appointment online in under a minute. Say goodbye to long phone queues and tedious clinic waiting lines.
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row">
            <Link to="/doctors" className="btn btn-accent btn-lg">
              <Calendar className="h-5 w-5" /> Book Appointment
            </Link>
            <Link to="/doctors" className="btn btn-lg border border-white/20 bg-white/10 text-white hover:bg-white/20">
              <Search className="h-5 w-5" /> Find a Doctor
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-teal-100">
            {credentials.map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-300" strokeWidth={3} /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
