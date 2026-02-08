import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Phone, Clock, Star, Badge, Calendar,
  Users, AlertCircle, ArrowLeft, ChevronRight, Building2,
  Stethoscope, Heart, Shield, Zap, CheckCircle2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hospitalAPI, slotAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingModal from '../components/BookingModal';

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

  // Format date for display
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading hospital details..." />;
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-4"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Hospital Not Found</h2>
          <p className="text-gray-500 mb-6">The hospital you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/hospitals')}
            className="inline-flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-all font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Hospitals</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50">
      {/* Premium Hero Header */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-40 h-40 bg-secondary-400/15 rounded-full blur-2xl" />
        </div>

        {/* Floating Hospital Icon */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute top-10 right-10 md:right-20"
        >
          <Building2 className="w-32 h-32 md:w-48 md:h-48 text-white" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Hospitals</span>
          </motion.button>

          {/* Hospital Name & Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-start md:justify-between gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  {hospital.name}
                </h1>
                {hospital.verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="bg-green-400/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1"
                  >
                    <Shield className="w-4 h-4 text-green-300" />
                    <span className="text-sm font-medium text-green-100">Verified</span>
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center text-white/80 mb-4">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-lg">{hospital.location?.address}</span>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                  <span className="font-bold text-white text-lg">
                    {hospital.rating?.average?.toFixed(1) || '4.0'}
                  </span>
                  <span className="text-white/70 ml-2">
                    ({hospital.rating?.count || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Badge */}
            {hospital.facilities?.isEmergency && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-red-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-2xl text-center shadow-lg"
              >
                <Zap className="w-8 h-8 mx-auto mb-2 fill-current" />
                <div className="font-bold text-lg">24×7 Emergency</div>
                <div className="text-sm text-white/80">Always Open</div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white shadow-lg border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {/* OPD Hours */}
            <div className="flex items-center space-x-3 py-5 px-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">OPD Hours</p>
                <p className="font-bold text-gray-800">
                  {hospital.opdHours?.start || '09:00'} - {hospital.opdHours?.end || '18:00'}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center space-x-3 py-5 px-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Contact</p>
                <p className="font-bold text-gray-800">{hospital.contact?.phone || 'N/A'}</p>
              </div>
            </div>

            {/* Current Queue */}
            <div className="flex items-center space-x-3 py-5 px-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Current Queue</p>
                <p className="font-bold text-gray-800">
                  {hospital.queueLength || 0} patients
                </p>
              </div>
            </div>

            {/* Wait Time */}
            <div className="flex items-center space-x-3 py-5 px-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Est. Wait</p>
                <p className="font-bold text-gray-800">~{hospital.currentWaitTime || 0} min</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Consultation Fee Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-5 h-5 text-white/80" />
                  <p className="text-white/80 font-medium">Consultation Fee Range</p>
                </div>
                <p className="text-4xl font-bold">
                  ₹{hospital.fees?.min || 0} - ₹{hospital.fees?.max || 0}
                </p>
                <p className="text-white/70 text-sm mt-2">Fee may vary based on specialty</p>
              </div>
            </motion.div>

            {/* Specialties Section */}
            {hospital.specialties && hospital.specialties.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Specialties Available</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hospital.specialties.map((specialty, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + idx * 0.05 }}
                      whileHover={{ scale: 1.03 }}
                      className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-primary-200 px-4 py-3 rounded-xl transition-all cursor-default group"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{specialty.icon || '🏥'}</span>
                        <span className="font-semibold text-gray-700 group-hover:text-primary-600 transition-colors">
                          {specialty.name || specialty}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Available Slots Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Available Time Slots</h2>
                      <p className="text-sm text-gray-500">{formatDisplayDate(selectedDate)}</p>
                    </div>
                  </div>
                  
                  {/* Date Picker */}
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-gray-700 cursor-pointer hover:border-primary-300"
                    />
                  </div>
                </div>
              </div>

              {/* Slots Grid */}
              <div className="p-6">
                {slots.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {slots.map((slot, idx) => (
                      <motion.div
                        key={slot._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-primary-200 rounded-xl p-5 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-2xl font-bold text-gray-800">
                              {slot.startTime} - {slot.endTime}
                            </div>
                            {slot.doctor && (
                              <p className="text-gray-500 mt-1">
                                Dr. {slot.doctor.name}
                              </p>
                            )}
                          </div>
                          <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                            slot.availableCount > 5 
                              ? 'bg-green-100 text-green-700' 
                              : slot.availableCount > 0
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-500'
                          }`}>
                            {slot.availableCount} slots
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleBookSlot(slot)}
                          disabled={slot.availableCount === 0}
                          className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center space-x-2 ${
                            slot.availableCount > 0 
                              ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg'
                              : 'bg-gray-300 cursor-not-allowed'
                          }`}
                        >
                          {slot.availableCount > 0 ? (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              <span>Book This Slot</span>
                            </>
                          ) : (
                            <span>Fully Booked</span>
                          )}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Slots Available</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      There are no appointment slots available for the selected date. Please try choosing a different date.
                    </p>
                    <div className="inline-flex items-center space-x-2 text-primary-600 font-medium">
                      <Calendar className="w-5 h-5" />
                      <span>Select another date above</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a 
                  href={`tel:${hospital.contact?.phone}`}
                  className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-700">Call Hospital</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${hospital.location?.coordinates?.lat},${hospital.location?.coordinates?.lng}`, '_blank')}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-700">Get Directions</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Hospital Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6 border border-primary-100"
            >
              <h3 className="font-bold text-gray-800 mb-4">Why Choose Us?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Shield className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Verified Hospital</p>
                    <p className="text-sm text-gray-600">All credentials verified</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Zap className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Instant Booking</p>
                    <p className="text-sm text-gray-600">No waiting, book instantly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Heart className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Quality Care</p>
                    <p className="text-sm text-gray-600">Trusted by thousands</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Need Help */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-900 rounded-2xl p-6 text-white"
            >
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Our support team is available 24/7 to assist you with your booking.
              </p>
              <a 
                href="tel:+919999999999"
                className="inline-flex items-center space-x-2 bg-white text-gray-900 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Support</span>
              </a>
            </motion.div>
          </div>
        </div>
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
