import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Stethoscope } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { services } from '../config/services';

const Services = () => {
  return (
    <div className="container-custom animate-fade-in-up py-16 sm:py-20 lg:py-24">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <p className="eyebrow justify-center">Our services</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Complete care across every specialty.
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          A wide range of medical services to meet all your healthcare needs — delivered with expertise and compassion.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="flex h-full flex-col">
            <span className="icon-chip mb-4">
              <service.Icon className="h-6 w-6" />
            </span>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{service.label}</h3>
            <p className="mb-4 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-400">{service.description}</p>
            <ul className="mb-5 space-y-1.5">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link to={`/services/${service.id}`} className="mt-auto">
              <Button variant="outline" size="sm" fullWidth icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                Learn more
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      <div className="mt-16">
        <div className="section-shell rounded-[2rem] bg-gradient-to-br from-primary-50 via-white to-slate-50 p-8 text-center sm:p-10 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900">
          <span className="icon-chip mx-auto mb-4">
            <Stethoscope className="h-6 w-6" />
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Need help choosing a service?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Our team is here to help you find the right specialist and service for your needs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button variant="primary" size="lg">Contact us</Button>
            </Link>
            <Link to="/doctors">
              <Button variant="outline" size="lg">Find a doctor</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
