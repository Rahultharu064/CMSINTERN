import React, { useState, useMemo, useEffect } from 'react';
import { SearchX, ChevronLeft, ChevronRight } from 'lucide-react';
import DoctorCard from './DoctorCard';
import { doctorsData } from '../../utils/dummyData';

const DoctorsList = ({ searchQuery, filters }) => {
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const filteredDoctors = useMemo(() => {
    return doctorsData.filter(doctor => {
      // Search filter
      const searchMatch = searchQuery.trim() === '' || 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());

      // Specialty filter
      const specialtyMatch = filters.specialty === '' || 
        doctor.specialty === filters.specialty;

      // Availability filter
      const availabilityMatch = filters.availability === '' || 
        doctor.availability === filters.availability;

      // Rating filter
      let ratingMatch = true;
      if (filters.rating !== '') {
        const minRating = parseFloat(filters.rating);
        ratingMatch = doctor.rating >= minRating;
      }

      // Experience filter
      let experienceMatch = true;
      if (filters.experience !== '') {
        const expRange = filters.experience;
        if (expRange === '0-5') experienceMatch = doctor.experience <= 5;
        else if (expRange === '5-10') experienceMatch = doctor.experience > 5 && doctor.experience <= 10;
        else if (expRange === '10-15') experienceMatch = doctor.experience > 10 && doctor.experience <= 15;
        else if (expRange === '15+') experienceMatch = doctor.experience > 15;
      }

      return searchMatch && specialtyMatch && availabilityMatch && ratingMatch && experienceMatch;
    });
  }, [searchQuery, filters]);

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card card--flat">
            <div className="flex items-start gap-4">
              <div className="skeleton skeleton-circle" style={{ width: '5rem', height: '5rem', borderRadius: '1rem' }} />
              <div className="flex-1 space-y-2 pt-1">
                <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                <div className="skeleton skeleton-text" style={{ width: '40%' }} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="skeleton skeleton-text" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredDoctors.length === 0) {
    return (
      <div className="card card--flat p-12 text-center">
        <span className="icon-chip mx-auto mb-4 h-14 w-14">
          <SearchX className="h-7 w-7" />
        </span>
        <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-white">No doctors found</h3>
        <p className="mx-auto max-w-md text-slate-500 dark:text-slate-400">
          Try adjusting your search or filters to find the right specialist for you.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between mb-4 flex-wrap gap-2">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-white">{paginatedDoctors.length}</span> of{' '}
          <span className="font-semibold text-slate-900 dark:text-white">{filteredDoctors.length}</span> doctors
        </p>
        {filteredDoctors.length > itemsPerPage && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
        {paginatedDoctors.map(doctor => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary btn-sm"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;