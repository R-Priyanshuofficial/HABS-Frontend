import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MapPin, Phone, Clock, Star, Badge, Calendar,
  Users, AlertCircle, ArrowLeft, ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { hospitalAPI, slotAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingModal from '../components/BookingModal';
import { useNavigate } from 'react-router-dom';

const HospitalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchHospitalDetails();
    fetchSlots();
  }, [id, selectedDate]);

  const fetchHospitalDetails = async () => {
    try {
      const response = await hospitalAPI.getById(id);
      if (response.data.success) {
        setHospital(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching hospital:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const response = await slotAPI.getAll({
        hospital: id,
        date: selectedDate
      });
      if (response.data.success) {
        setSlots(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  if (loading) {
    return <LoadingSpinner message="Loading hospital details..." />;
  }

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hospital Not Found</h2>
          <button
            onClick={() => navigate('/hospitals')}
            className="text-primary-500 hover:underline"
          >
            Back to Hospitals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hospital Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{hospital.name}</h1>
                {hospital.verified && (
                  <Badge className="w-6 h-6 text-primary-500" />
                )}
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{hospital.location?.address}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold text-gray-800">
                    {hospital.rating?.average?.toFixed(1) || '4.0'}
                  </span>
                  <span className="text-gray-500 ml-1">
                    ({hospital.rating?.count || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {hospital.facilities?.isEmergency && (
              <div className="mt-4 md:mt-0">
                <div className="bg-red-100 text-red-700 px-6 py-3 rounded-lg text-center">
                  <AlertCircle className="w-6 h-6 mx-auto mb-1" />
                  <div className="font-bold">24x7 Emergency</div>
                  <div className="text-sm">Always Open</div>
                </div>
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-primary-500" />
              <div>
                <p className="text-sm text-gray-600">OPD Hours</p>
                <p className="font-semibold text-gray-800">
                  {hospital.opdHours?.start || '9:00'} - {hospital.opdHours?.end || '20:00'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="w-6 h-6 text-primary-500" />
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-semibold text-gray-800">{hospital.contact?.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-primary-500" />
              <div>
                <p className="text-sm text-gray-600">Current Queue</p>
                <p className="font-semibold text-gray-800">
                  {hospital.queueLength || 0} patients • ~{hospital.currentWaitTime || 0} min wait
                </p>
              </div>
            </div>
          </div>

          {/* Consultation Fee */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Consultation Fee Range</p>
            <p className="text-2xl font-bold text-primary-600">
              ₹{hospital.fees?.min || 0} - ₹{hospital.fees?.max || 0}
            </p>
          </div>
        </motion.div>

        {/* Specialties */}
        {hospital.specialties && hospital.specialties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Specialties Available</h2>
            <div className="flex flex-wrap gap-3">
              {hospital.specialties.map((specialty, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 px-4 py-2 rounded-lg"
                >
                  <span className="font-semibold text-primary-700">
                    {specialty.icon || '🏥'} {specialty.name || specialty}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Available Slots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Available Time Slots</h2>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {slots.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-gray-800">
                      {slot.startTime} - {slot.endTime}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      slot.availableCount > 5 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {slot.availableCount} slots
                    </div>
                  </div>
                  
                  {slot.doctor && (
                    <p className="text-sm text-gray-600 mb-2">
                      Dr. {slot.doctor.name}
                    </p>
                  )}

                  <button
                    onClick={() => handleBookSlot(slot)}
                    disabled={slot.availableCount === 0}
                    className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {slot.availableCount > 0 ? 'Book Now' : 'Fully Booked'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No slots available for this date</p>
              <p className="text-sm text-gray-500 mt-2">Try selecting a different date</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        slot={selectedSlot}
        hospital={hospital}
      />
    </div>
  );
};

export default HospitalDetail;
