import React, { useState } from 'react';
import { SlidersHorizontal, ChevronUp, ChevronDown, Star } from 'lucide-react';
import { SPECIALTIES, AVAILABILITY_OPTIONS, RATING_OPTIONS, EXPERIENCE_RANGES } from '../../utils/constants';

const FilterSection = ({ filters, setFilters }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      specialty: '',
      availability: '',
      rating: '',
      experience: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="card card--flat p-6">
      <div className="flex-between mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <SlidersHorizontal className="h-5 w-5 text-primary-600 dark:text-primary-400" /> Filters
        </h3>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-500 hover:text-slate-700 lg:hidden dark:text-slate-400"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Specialty Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Specialty
          </label>
          <select
            value={filters.specialty}
            onChange={(e) => handleFilterChange('specialty', e.target.value)}
            className="select input"
          >
            {SPECIALTIES.map(specialty => (
              <option key={specialty} value={specialty === 'All Specialties' ? '' : specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Availability
          </label>
          <select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            className="select input"
          >
            {AVAILABILITY_OPTIONS.map(option => (
              <option key={option} value={option === 'All' ? '' : option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Minimum rating
          </label>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="select input"
          >
            {RATING_OPTIONS.map(option => (
              <option key={option} value={option === 'All' ? '' : option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Experience (years)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {EXPERIENCE_RANGES.map(range => (
              <button
                key={range}
                onClick={() => handleFilterChange('experience', filters.experience === range ? '' : range)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  filters.experience === range
                    ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/25 dark:text-primary-200'
                    : 'border-slate-300 text-slate-600 hover:border-primary-300 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
            <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">Active filters</p>
            <div className="flex flex-wrap gap-1.5">
              {filters.specialty && <span className="badge badge-primary">{filters.specialty}</span>}
              {filters.availability && <span className="badge badge-success">{filters.availability}</span>}
              {filters.rating && (
                <span className="badge badge-warning inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" /> {filters.rating}
                </span>
              )}
              {filters.experience && <span className="badge badge-info">{filters.experience} yrs</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;