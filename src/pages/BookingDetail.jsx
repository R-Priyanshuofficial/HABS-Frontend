import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, MapPin, Calendar, Clock, User, Phone,
  ArrowLeft, Download, Share2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { bookingAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await bookingAPI.getById(id);
      if (response.data.success) {
        setBooking(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading booking details..." />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary-500 hover:underline"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border-2 border-green-200 rounded-xl p-8 mb-8 text-center"
        >
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your appointment has been successfully booked
          </p>
        </motion.div>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          {/* Token Number */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-8 text-center">
            <p className="text-sm opacity-90 mb-2">Your Token Number</p>
            <p className="text-6xl font-bold">#{booking.tokenNumber}</p>
          </div>

          <div className="p-8">
            {/* Hospital Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {booking.hospital?.name}
              </h2>
              <div className="flex items-start space-x-2 text-gray-600">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>{booking.hospital?.location?.address}</span>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Appointment Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(booking.appointmentDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Slot</p>
                  <p className="font-semibold text-gray-800">
                    {booking.slot?.startTime} - {booking.slot?.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Patient Name</p>
                  <p className="font-semibold text-gray-800">{booking.user?.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-semibold text-gray-800">{booking.user?.phone}</p>
                </div>
              </div>
            </div>

            {/* Queue Info */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-800 mb-4">Queue Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Your Position</p>
                  <p className="text-2xl font-bold text-orange-600">#{booking.queuePosition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Wait</p>
                  <p className="text-2xl font-bold text-orange-600">~{booking.estimatedWaitTime} min</p>
                </div>
              </div>
            </div>

            {/* Important Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-3">Important Instructions</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Please arrive 10 minutes before your appointment time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Bring a valid ID proof and previous medical records if any</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Show your token number at the reception</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>For any changes, please contact the hospital directly</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'HABS Booking',
                  text: `Appointment at ${booking.hospital?.name} - Token #${booking.tokenNumber}`,
                });
              }
            }}
            className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex items-center justify-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            <span>View All Bookings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
