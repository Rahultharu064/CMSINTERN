import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Building2,
  MapPin,
  Wallet,
  Languages,
  Briefcase,
  GraduationCap,
  CalendarCheck,
  Heart,
  CheckCircle2,
  Clock,
  Frown,
} from 'lucide-react';
import { doctorsData } from '../utils/dummyData';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getInitials } from '../utils/helpers';

const availabilityStyles = {
  'Available Today': 'badge-success',
  'This Week': 'badge-info',
  'Next Week': 'badge-warning',
};

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const doctor = doctorsData.find((d) => d.id === parseInt(id));

  if (!doctor) {
    return (
      <div className="flex-center min-h-[60vh]">
        <div className="text-center">
          <span className="icon-chip mx-auto mb-4 h-16 w-16">
            <Frown className="h-8 w-8" />
          </span>
          <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">Doctor not found</h2>
          <p className="mb-6 text-slate-500 dark:text-slate-400">The doctor you’re looking for doesn’t exist.</p>
          <Link to="/doctors">
            <Button variant="primary" icon={<ArrowLeft className="h-4 w-4" />}>Back to doctors</Button>
          </Link>
        </div>
      </div>
    );
  }

  const showImage = doctor.image && !imgError;

  const details = [
    { Icon: Building2, label: 'Hospital', value: doctor.hospital },
    { Icon: MapPin, label: 'Location', value: doctor.location },
    { Icon: Wallet, label: 'Consultation fee', value: `Rs. ${doctor.consultationFee}` },
    { Icon: Languages, label: 'Languages', value: doctor.languages.join(', ') },
    { Icon: Briefcase, label: 'Experience', value: `${doctor.experience} years` },
  ];

  return (
    <div className="container-custom animate-fade-in-up py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Card hoverable={false} padding={false} className="overflow-hidden">
        {/* Header banner */}
        <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-sky-600 p-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            {showImage ? (
              <img
                src={doctor.image}
                alt={doctor.name}
                onError={() => setImgError(true)}
                className="h-28 w-28 shrink-0 rounded-2xl border-4 border-white/40 object-cover shadow-lg"
              />
            ) : (
              <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-4 border-white/40 bg-white/20 text-3xl font-bold text-white shadow-lg">
                {getInitials(doctor.name.replace('Dr. ', ''))}
              </span>
            )}
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold">{doctor.name}</h1>
              <p className="mt-1 text-lg font-medium text-sky-100">{doctor.specialty}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold backdrop-blur-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  {doctor.rating}
                  <span className="font-normal text-white/80">({doctor.reviews} reviews)</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
                  <Briefcase className="h-3.5 w-3.5" /> {doctor.experience} yrs
                </span>
                <span className={`badge ${availabilityStyles[doctor.availability] || 'badge-gray'}`}>
                  {doctor.availability}
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 md:w-auto">
              <Button variant="white" size="lg" fullWidth icon={<CalendarCheck className="h-5 w-5" />}>
                Book appointment
              </Button>
              <Button variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20" fullWidth icon={<Heart className="h-4 w-4" />}>
                Save to favorites
              </Button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">About</h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">{doctor.bio}</p>

              <h3 className="mb-3 mt-6 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <GraduationCap className="h-5 w-5 text-primary-600 dark:text-primary-400" /> Education
              </h3>
              <p className="text-slate-600 dark:text-slate-300">{doctor.education}</p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Details</h3>
              <div className="space-y-1">
                {details.map(({ Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0 dark:border-slate-700"
                  >
                    <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Icon className="h-4 w-4" /> {label}
                    </span>
                    <span className="text-right font-medium text-slate-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-700">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400" /> Availability schedule
            </h3>
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
              <div className="flex flex-wrap gap-5">
                {[
                  { color: 'bg-emerald-500', label: 'Available today' },
                  { color: 'bg-primary-500', label: 'This week' },
                  { color: 'bg-amber-500', label: 'Next week' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-slate-600 dark:text-slate-300">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-3 dark:text-slate-300">
                <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Sun–Fri: 9:00 AM – 6:00 PM</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Saturday: 9:00 AM – 2:00 PM</p>
                <p className="flex items-center gap-2 text-slate-400"><Clock className="h-4 w-4" /> Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DoctorDetail;
