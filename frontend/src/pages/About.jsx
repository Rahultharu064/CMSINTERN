import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, FlaskConical, ShieldCheck, Globe2, Users, Star, CalendarClock, Building2, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const values = [
  { Icon: Heart, title: 'Patient first', description: 'We prioritise patient care and comfort above all else.' },
  { Icon: FlaskConical, title: 'Innovation', description: 'Embracing the latest medical technologies and treatments.' },
  { Icon: ShieldCheck, title: 'Integrity', description: 'Honest, transparent, and trustworthy healthcare.' },
  { Icon: Globe2, title: 'Community', description: 'Serving our community with dedication and compassion.' },
];

const stats = [
  { Icon: Users, value: '500+', label: 'Verified doctors' },
  { Icon: CalendarClock, value: '10k+', label: 'Appointments booked' },
  { Icon: Star, value: '4.9/5', label: 'Average patient rating' },
  { Icon: Building2, value: '50+', label: 'Specialties covered' },
];

const About = () => {
  return (
    <div className="container-custom animate-fade-in-up py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">About us</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Modern, compassionate care for Nepal.
          </h1>
        </div>

        <Card hoverable={false} className="mt-10">
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            Welcome to <strong className="text-slate-900 dark:text-white">ClinicMS</strong>, your trusted healthcare
            partner in Nepal. We are dedicated to providing exceptional medical care with a focus on patient comfort,
            transparency, and satisfaction.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            Our team of experienced doctors and healthcare professionals work tirelessly to ensure you receive the best
            possible treatment using modern facilities and technology — from online booking to live queue tracking and
            secure digital payments.
          </p>
        </Card>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ Icon, value, label }) => (
            <Card key={label} className="text-center">
              <span className="icon-chip mx-auto mb-3">
                <Icon className="h-6 w-6" />
              </span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</div>
            </Card>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="eyebrow justify-center">What we stand for</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Our core values</h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {values.map(({ Icon, title, description }) => (
            <Card key={title} className="flex items-start gap-4">
              <span className="icon-chip">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/doctors">
            <Button variant="primary" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
              Meet our doctors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
