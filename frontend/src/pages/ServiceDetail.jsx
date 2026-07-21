import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, UserRound, CalendarClock, SearchX } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getService } from '../config/services';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = getService(serviceId);

  if (!service) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <span className="icon-chip mx-auto mb-4 h-16 w-16">
            <SearchX className="h-8 w-8" />
          </span>
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Service not found</h1>
          <p className="mb-6 text-slate-600 dark:text-slate-400">The service you’re looking for doesn’t exist.</p>
          <Link to="/services">
            <Button variant="primary" icon={<ArrowLeft className="h-4 w-4" />}>Back to services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { Icon } = service;

  return (
    <div className="container-custom animate-fade-in-up py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Card hoverable={false} padding={false} className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-sky-600 p-8">
          <div className="flex items-center gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
              <Icon className="h-8 w-8" />
            </span>
            <div className="text-white">
              <h1 className="text-3xl font-bold">{service.label}</h1>
              <p className="mt-1 text-sky-100">{service.tagline}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">About this service</h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">{service.longDescription}</p>

              <h3 className="mb-3 mt-6 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <UserRound className="h-5 w-5 text-primary-600 dark:text-primary-400" /> Available doctors
              </h3>
              <ul className="space-y-2">
                {service.doctors.map((doctor) => (
                  <li key={doctor} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" /> {doctor}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Procedures &amp; treatments</h3>
              <ul className="space-y-2">
                {service.procedures.map((procedure) => (
                  <li key={procedure} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" /> {procedure}
                  </li>
                ))}
              </ul>

              <h3 className="mb-3 mt-6 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <CalendarClock className="h-5 w-5 text-primary-600 dark:text-primary-400" /> Availability
              </h3>
              <p className="text-slate-600 dark:text-slate-300">{service.availability}</p>

              <div className="mt-6">
                <Link to="/doctors">
                  <Button variant="primary" size="lg" fullWidth icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                    Book an appointment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServiceDetail;
