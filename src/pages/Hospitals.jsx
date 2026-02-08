import React, { useState, useEffect } from 'react';
import { Filter, MapPin, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import HospitalCard from '../components/HospitalCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SymptomSearch from '../components/SymptomSearch';
import { hospitalAPI, specialtyAPI } from '../services/api';
import { useApp } from '../context/AppContext';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Hospitals & Clinics</h1>
          <p className="text-lg opacity-90">
            {selectedSpecialty 
              ? `Showing ${selectedSpecialty.name} specialists near you`
              : 'Discover the best healthcare facilities in Rajkot'}
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SymptomSearch onSearch={fetchHospitals} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              </div>

              {/* Specialty Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specialty
                </label>
                <select
                  value={filters.specialty}
                  onChange={(e) => handleFilterChange('specialty', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty._id} value={specialty.name}>
                      {specialty.icon} {specialty.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Emergency Filter */}
              <div className="mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.emergency}
                    onChange={(e) => handleFilterChange('emergency', e.target.checked)}
                    className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    24x7 Emergency Only
                  </span>
                </label>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="waitTime">Wait Time</option>
                  <option value="fees">Fees</option>
                </select>
              </div>

              {/* Location Info */}
              {userLocation && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-primary-700 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-semibold">Your Location</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Showing results near you
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Results */}
          <main className="lg:col-span-3">
            {loading ? (
              <LoadingSpinner message="Finding best hospitals for you..." />
            ) : hospitals.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {hospitals.length} Hospital{hospitals.length !== 1 ? 's' : ''} Found
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Zap className="w-4 h-4 text-green-500" />
                    <span>Live availability</span>
                  </div>
                </div>

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
                <div className="bg-white rounded-xl shadow-md p-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    No Hospitals Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        specialty: '',
                        emergency: false,
                        sortBy: 'distance'
                      });
                    }}
                    className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
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
