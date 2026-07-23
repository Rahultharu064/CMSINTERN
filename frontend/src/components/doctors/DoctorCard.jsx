import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Briefcase, Wallet, Star, ArrowRight, Stethoscope } from 'lucide-react';
import Card from '../ui/Card';
import { getInitials } from '../../utils/helpers';

const availabilityStyles = {
  'Available Today': 'badge-success',
  'This Week': 'badge-info',
  'Next Week': 'badge-warning',
};

const DoctorCard = ({ doctor }) => {
  const [imgError, setImgError] = useState(false);
  const showImage = doctor.image && !imgError;

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start gap-4">
        {showImage ? (
          <img
            src={doctor.image}
            alt={doctor.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-20 w-20 shrink-0 rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
          />
        ) : (
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-2xl font-bold text-white">
            {getInitials(doctor.name.replace('Dr. ', ''))}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">{doctor.name}</h3>
              <p className="flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400">
                <Stethoscope className="h-3.5 w-3.5" />
                {doctor.specialty}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-900/25 dark:text-amber-300">
              <Star className="h-3.5 w-3.5 fill-current" />
              {doctor.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid flex-1 grid-cols-2 gap-2.5 text-sm">
        <div className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-400">
          <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate">{doctor.hospital}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate">{doctor.location}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Briefcase className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{doctor.experience} yrs exp.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Wallet className="h-4 w-4 shrink-0 text-slate-400" />
          <span>Rs. {doctor.consultationFee}</span>
        </div>
      </div>

      {doctor.languages?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {doctor.languages.map((lang) => (
            <span key={lang} className="badge badge-gray">{lang}</span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
        <span className={`badge ${availabilityStyles[doctor.availability] || 'badge-gray'}`}>
          {doctor.availability}
        </span>
        <Link to={`/doctors/${doctor.id}`} className="btn btn-primary btn-sm">
          Book <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
};

export default DoctorCard;
