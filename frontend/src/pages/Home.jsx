import React from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Building2,
  CreditCard,
  MapPin,
  CheckCircle2,
  ArrowRight,
  CalendarClock,
  MonitorSmartphone,
  MessageSquareHeart,
  Users,
  Star,
  BadgeCheck,
} from 'lucide-react';
import HeroSection from '../components/doctors/HeroSection.jsx';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { services } from '../config/services';

const features = [
  { Icon: Stethoscope, title: 'Expert doctors', description: 'Board-certified specialists with years of hands-on clinical experience.' },
  { Icon: Building2, title: 'Modern facilities', description: 'Contemporary care spaces equipped for advanced diagnostics and comfort.' },
  { Icon: CreditCard, title: 'Flexible payments', description: 'Pay online with eSewa or Khalti, or settle at the counter — your choice.' },
  { Icon: MapPin, title: 'Convenient access', description: 'Easy appointments, fast support, and dependable follow-through.' },
];

const stats = [
  { value: '500+', label: 'Doctors', Icon: Users },
  { value: '50+', label: 'Specialties', Icon: Stethoscope },
  { value: '4.9/5', label: 'Average rating', Icon: Star },
  { value: '10k+', label: 'Appointments', Icon: CalendarClock },
];

const differentiators = [
  '24/7 emergency support and seamless appointment coordination.',
  'Modern telehealth and in-person visits designed for flexibility.',
  'Clear communication, transparent care plans, and dependable follow-up.',
];

const steps = [
  { Icon: Stethoscope, title: 'Choose a doctor', description: 'Browse verified specialists by department, rating, and availability.' },
  { Icon: CalendarClock, title: 'Pick a slot', description: 'See live availability and reserve your appointment in seconds.' },
  { Icon: MonitorSmartphone, title: 'Track your visit', description: 'Follow your live queue token and pay online — no waiting-room guesswork.' },
];

const Home = () => {
  return (
    <div>
      <HeroSection />

      {/* Features */}
      <div className="container-custom py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">Why choose us</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Thoughtful care for every step of your health journey.
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            We combine medical excellence with a smooth digital experience so every appointment feels effortless.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map(({ Icon, title, description }) => (
            <Card key={title} className="text-left">
              <span className="icon-chip mb-4">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{description}</p>
            </Card>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Book in three simple steps.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(({ Icon, title, description }, index) => (
              <Card key={title} hoverable={false} className="relative overflow-visible">
                <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white shadow">
                  {index + 1}
                </span>
                <span className="icon-chip mb-4 mt-1">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact + differentiators */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card hoverable={false} padding={false} className="overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-800 text-white">
            <div className="p-8">
              <p className="eyebrow justify-start text-slate-300">Our impact</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Trusted by patients who expect more.</h3>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {stats.map(({ value, label, Icon }) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-sky-300" />
                    <div className="mt-2 text-3xl font-bold text-white">{value}</div>
                    <div className="mt-1 text-sm text-slate-300">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card hoverable={false}>
            <p className="eyebrow justify-start">What sets us apart</p>
            <ul className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
              {differentiators.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/doctors">
                <Button variant="primary" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                  Find your doctor
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Popular specialties */}
        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow justify-start">Departments</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Popular specialties
              </h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-300">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {services.slice(0, 6).map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/70"
              >
                <span className="icon-chip transition-transform group-hover:scale-110">
                  <service.Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{service.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16">
          <Card hoverable={false} className="bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900">
            <MessageSquareHeart className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <blockquote className="mt-4 text-xl font-medium leading-relaxed text-slate-800 dark:text-slate-100 sm:text-2xl">
              “Booking took less than a minute and the live queue token meant I didn’t waste an hour in the
              waiting room. This is how a modern clinic should feel.”
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 font-semibold text-white">AK</span>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Anita K.</p>
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <BadgeCheck className="h-3.5 w-3.5 text-primary-500" /> Verified patient
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-16 overflow-hidden rounded-[32px] bg-gradient-to-r from-primary-700 via-primary-600 to-sky-600 p-8 text-white shadow-xl shadow-primary-900/20 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow justify-start text-primary-100">Ready to get started?</p>
              <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">Book your visit and experience modern care today.</h3>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/doctors">
                <Button variant="white" size="lg" className="w-full sm:w-auto">
                  Book appointment
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full border-white/50 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                  Contact our team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
