import React from 'react';
import { MapPin, Phone, Clock, Star, Users, Badge } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HospitalCard = ({ hospital, index = 0 }) => {
  const navigate = useNavigate();

  const calculateDistance = (coordinates) => {
    // Simple distance calculation (in real app, use proper geolocation)
    return Math.random() * 5 + 0.5;
  };

  const distance = hospital.location?.coordinates 
    ? calculateDistance(hospital.location.coordinates).toFixed(1)
    : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer card-hover border border-gray-100"
      onClick={() => navigate(`/hospital/${hospital._id}`)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-gray-800">{hospital.name}</h3>
              {hospital.verified && (
                <Badge className="w-5 h-5 text-primary-500" />
              )}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{hospital.location?.address}</span>
            </div>
          </div>
          
          {hospital.facilities?.isEmergency && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
              24x7 Emergency
            </span>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {hospital.opdHours?.start || '9:00'} - {hospital.opdHours?.end || '20:00'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{hospital.contact?.phone || 'N/A'}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-semibold text-gray-800">
              {hospital.rating?.average?.toFixed(1) || '4.0'}
            </span>
            <span className="text-gray-500 text-sm">
              ({hospital.rating?.count || 0} reviews)
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {distance} km away
          </div>
        </div>

        {/* Queue Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary-500" />
            <div>
              <p className="text-sm text-gray-600">Queue Length</p>
              <p className="font-semibold text-gray-800">{hospital.queueLength || 0} patients</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Est. Wait Time</p>
            <p className="font-semibold text-gray-800">{hospital.currentWaitTime || 0} min</p>
          </div>
        </div>

        {/* Fees */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Consultation Fee</p>
            <p className="text-lg font-bold text-primary-600">
              ₹{hospital.fees?.min || 0} - ₹{hospital.fees?.max || 0}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/hospital/${hospital._id}`);
            }}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Book Now
          </button>
        </div>

        {/* Specialties */}
        {hospital.specialties && hospital.specialties.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Specialties:</p>
            <div className="flex flex-wrap gap-2">
              {hospital.specialties.slice(0, 3).map((specialty, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {specialty.name || specialty}
                </span>
              ))}
              {hospital.specialties.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  +{hospital.specialties.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HospitalCard;
