import React, { useState } from 'react';
import HeroSection from '../components/doctors/HeroSection';
import SearchBar from '../components/doctors/SearchBar';
import FilterSection from '../components/doctors/FilterSection';
import DoctorsList from '../components/doctors/DoctorList';

const Doctor = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    availability: '',
    rating: '',
    experience: '',
  });

  return (
    <div>
      <HeroSection />

      <div className="container-custom relative z-10 -mt-8 pb-16">
        <div className="card mb-8 p-5 sm:p-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full flex-shrink-0 lg:w-72">
            <div className="lg:sticky lg:top-24">
              <FilterSection filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          <div className="flex-1">
            <DoctorsList searchQuery={searchQuery} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
