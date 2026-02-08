import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, XCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { bookingAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingAPI.getMyBookings();
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      toast.error('Error fetching your bookings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await bookingAPI.cancel(bookingId);
      if (response.data.success) {
        toast.success('Booking cancelled successfully');
        // Refresh bookings
        fetchBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
      no_show: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    if (status === 'confirmed' || status === 'completed') {
      return <CheckCircle className="w-5 h-5" />;
    }
    return <XCircle className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">My Bookings</h1>
          <p className="text-lg opacity-90">Track and manage your appointments</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && <LoadingSpinner message="Fetching your bookings..." />}

        {/* Bookings List */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {bookings.length} Booking{bookings.length !== 1 ? 's' : ''} Found
            </h2>
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {booking.hospital?.name || 'Hospital Name'}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{booking.hospital?.location?.address}</span>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="font-semibold capitalize">{booking.status}</span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-primary-500" />
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

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary-500" />
                      <div>
                        <p className="text-sm text-gray-600">Time Slot</p>
                        <p className="font-semibold text-gray-800">
                          {booking.slot?.startTime} - {booking.slot?.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-primary-500" />
                      <div>
                        <p className="text-sm text-gray-600">Patient Name</p>
                        <p className="font-semibold text-gray-800">{booking.patientProfile?.fullName || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 flex items-center justify-center bg-primary-500 text-white rounded font-bold text-xs">
                        #
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Token Number</p>
                        <p className="font-semibold text-gray-800">#{booking.tokenNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Queue Info */}
                  {booking.status === 'confirmed' && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Queue Position</p>
                          <p className="text-lg font-bold text-primary-600">
                            Position #{booking.queuePosition}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Estimated Wait</p>
                          <p className="text-lg font-bold text-primary-600">
                            ~{booking.estimatedWaitTime} min
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Symptoms */}
                  {booking.symptoms && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Symptoms/Notes:</p>
                      <p className="text-gray-800">{booking.symptoms}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {booking.status === 'confirmed' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600 mb-4">You haven't made any appointments yet</p>
            <a
              href="/"
              className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              Browse Hospitals
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
