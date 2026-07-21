import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Live search as the user types
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
      if (onSearch) onSearch(localQuery);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    if (onSearch) onSearch(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, specialty, or location…"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="input pl-11 pr-11"
          aria-label="Search doctors"
        />
        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <button type="submit" className="btn btn-primary whitespace-nowrap">
        <Search className="h-4 w-4" /> Search
      </button>
    </form>
  );
};

export default SearchBar;
