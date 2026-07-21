import React, { useState } from 'react';
import HeroSection from '../components/doctors/HeroSection';
import SearchBar from '../components/doctors/SearchBar';
import FilterSection from '../components/doctors/FilterSection';
import DoctorsList from '../components/doctors/DoctorList';
import Card from '../components/ui/Card';

const Doctor = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    availability: '',
    rating: '',
    experience: ''
  });

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <div className="container-custom -mt-16 relative z-10">
        <Card className="p-6 mb-8 animate-slide-down">
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
        </Card>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-72 flex-shrink-0">
            <FilterSection filters={filters} setFilters={setFilters} />
          </div>
          
          <div className="flex-1">
            <DoctorsList 
              searchQuery={searchQuery} 
              filters={filters} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;