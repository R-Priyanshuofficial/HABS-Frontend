import React, { useState, useEffect, useRef } from 'react';
import { Filter, MapPin, Zap, ChevronDown, X, Sparkles, Search, Building2, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HospitalCard from '../components/HospitalCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SymptomSearch from '../components/SymptomSearch';
import { hospitalAPI, specialtyAPI } from '../services/api';
import { useApp } from '../context/AppContext';

// Custom Select Component with polished styling
const CustomSelect = ({ value, onChange, options, placeholder, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 
          bg-white border-2 rounded-xl
          flex items-center justify-between
          transition-all duration-200 ease-out
          text-left
          ${isOpen 
            ? 'border-primary-500 ring-4 ring-primary-500/10 shadow-lg' 
            : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
          }
        `}
      >
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-4 h-4 text-gray-400" />}
          <span className={value ? 'text-gray-800 font-medium' : 'text-gray-500'}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-4 py-3 text-left
                    flex items-center space-x-2
                    transition-colors duration-150
                    ${value === option.value 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {option.icon && <span className="text-lg">{option.icon}</span>}
                  <span>{option.label}</span>
                  {value === option.value && (
                    <span className="ml-auto">
                      <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: '',
    emergency: false,
    sortBy: 'distance'
  });
  const { specialties, userLocation, selectedSpecialty } = useApp();

  useEffect(() => {
    fetchHospitals();
  }, [filters, selectedSpecialty, userLocation]);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const params = {};
      
      if (selectedSpecialty) {
        params.specialty = selectedSpecialty.name;
      } else if (filters.specialty) {
        params.specialty = filters.specialty;
      }
      
      if (filters.emergency) {
        params.emergency = true;
      }

      if (userLocation) {
        params.lat = userLocation.lat;
        params.lng = userLocation.lng;
      }

      const response = await hospitalAPI.getAll(params);
      if (response.data.success) {
        setHospitals(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      specialty: '',
      emergency: false,
      sortBy: 'distance'
    });
  };

  const hasActiveFilters = filters.specialty || filters.emergency || filters.sortBy !== 'distance';

  // Convert specialties to options format
  const specialtyOptions = [
    { value: '', label: 'All Specialties' },
    ...specialties.map(s => ({ value: s.name, label: s.name, icon: s.icon }))
  ];

  const sortOptions = [
    { value: 'distance', label: 'Distance' },
    { value: 'rating', label: 'Rating' },
    { value: 'waitTime', label: 'Wait Time' },
    { value: 'fees', label: 'Fees' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-16 md:py-20 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-secondary-400/20 rounded-full blur-2xl" />
        </div>

        {/* Floating Icons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute top-10 right-10 md:right-20"
        >
          <Building2 className="w-24 h-24 md:w-32 md:h-32 text-white" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-10 left-10 md:left-20"
        >
          <Stethoscope className="w-20 h-20 md:w-28 md:h-28 text-white" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Find Your Perfect Healthcare Match</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Find Hospitals
              <span className="block text-white/90">&amp; Clinics</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/85 max-w-2xl">
              {selectedSpecialty 
                ? <span>Showing <span className="font-semibold text-white">{selectedSpecialty.name}</span> specialists near you</span>
                : 'Discover the best healthcare facilities in Rajkot with real-time availability'}
            </p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-8"
            >
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Building2 className="w-5 h-5 text-white/80" />
                <span className="font-semibold">30+ Hospitals</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Stethoscope className="w-5 h-5 text-white/80" />
                <span className="font-semibold">50+ Specialists</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-500/30 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Zap className="w-5 h-5 text-green-300" />
                <span className="font-semibold text-green-100">Live Updates</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <div className="bg-white shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SymptomSearch onSearch={fetchHospitals} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Independent Scroll */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-20">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-h-[calc(100vh-6rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Filter className="w-5 h-5 text-primary-600" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                    </div>
                    {hasActiveFilters && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={clearFilters}
                        className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Clear</span>
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Filter Content */}
                <div className="p-6 space-y-6">
                  {/* Specialty Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Specialty
                    </label>
                    <CustomSelect
                      value={filters.specialty}
                      onChange={(val) => handleFilterChange('specialty', val)}
                      options={specialtyOptions}
                      placeholder="All Specialties"
                    />
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Emergency Filter - Toggle Style */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Emergency Services
                    </label>
                    <button
                      onClick={() => handleFilterChange('emergency', !filters.emergency)}
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 
                        flex items-center justify-between
                        transition-all duration-200
                        ${filters.emergency 
                          ? 'border-red-500 bg-red-50 text-red-700' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-10 h-6 rounded-full relative transition-colors duration-200
                          ${filters.emergency ? 'bg-red-500' : 'bg-gray-300'}
                        `}>
                          <div className={`
                            absolute top-1 w-4 h-4 bg-white rounded-full shadow-md
                            transition-all duration-200
                            ${filters.emergency ? 'left-5' : 'left-1'}
                          `} />
                        </div>
                        <span className="font-medium">24×7 Emergency Only</span>
                      </div>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Sort By
                    </label>
                    <CustomSelect
                      value={filters.sortBy}
                      onChange={(val) => handleFilterChange('sortBy', val)}
                      options={sortOptions}
                      placeholder="Sort by"
                    />
                  </div>
                </div>

                {/* Location Info */}
                {userLocation && (
                  <div className="px-6 pb-6">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-blue-50 to-primary-50 rounded-xl p-4 border border-blue-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <MapPin className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary-700">Your Location</p>
                          <p className="text-xs text-gray-600">Showing results near you</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <LoadingSpinner message="Finding best hospitals for you..." />
            ) : hospitals.length > 0 ? (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between mb-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800">
                    {hospitals.length} Hospital{hospitals.length !== 1 ? 's' : ''} Found
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 px-3 py-1.5 rounded-full">
                    <Sparkles className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-green-700">Live availability</span>
                  </div>
                </motion.div>

                <div className="grid gap-6">
                  {hospitals.map((hospital, index) => (
                    <HospitalCard 
                      key={hospital._id} 
                      hospital={hospital} 
                      index={index}
                    />
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    No Hospitals Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-primary-500 text-white px-8 py-3 rounded-xl hover:bg-primary-600 transition-all font-medium shadow-lg hover:shadow-xl"
                  >
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Hospitals;

