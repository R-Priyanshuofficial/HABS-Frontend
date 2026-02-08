import React, { useState, useEffect } from 'react';
import { Users, Clock, Calendar, TrendingUp, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { bookingAPI, hospitalAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const HospitalDashboard = () => {
  const [selectedHospital, setSelectedHospital] = useState('');
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(false);
  const [queueUpdate, setQueueUpdate] = useState({
    queueLength: 0,
    currentWaitTime: 0
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock hospital list - in real app, this would come from authentication
  const hospitals = [
    { id: '1', name: 'Civil Hospital Rajkot' },
    { id: '2', name: 'Sterling Hospital' },
    { id: '3', name: 'HCG Cancer Centre' }
  ];

  useEffect(() => {
    if (selectedHospital) {
      fetchBookings();
    }
  }, [selectedHospital, selectedDate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingAPI.getByHospital(selectedHospital, {
        date: selectedDate
      });
      
      if (response.data.success) {
        const bookingData = response.data.data;
        setBookings(bookingData);
        
        // Calculate stats
        const stats = {
          total: bookingData.length,
          confirmed: bookingData.filter(b => b.status === 'confirmed').length,
          completed: bookingData.filter(b => b.status === 'completed').length,
          cancelled: bookingData.filter(b => b.status === 'cancelled').length
        };
        setStats(stats);
        
        // Update queue info
        setQueueUpdate({
          queueLength: stats.confirmed,
          currentWaitTime: stats.confirmed * 15 // 15 min per patient
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateQueue = async () => {
    try {
      await hospitalAPI.updateQueue(selectedHospital, queueUpdate);
      toast.success('Queue information updated');
    } catch (error) {
      toast.error('Failed to update queue');
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-xl shadow-md p-6 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon className="w-12 h-12 opacity-20" />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Hospital Dashboard</h1>
          <p className="text-lg opacity-90">Manage your appointments and queue</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hospital Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Hospital
          </label>
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="w-full md:w-1/2 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
          >
            <option value="">Choose a hospital...</option>
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>

        {selectedHospital && (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Calendar}
                label="Total Bookings"
                value={stats.total}
                color="text-blue-600"
              />
              <StatCard
                icon={Users}
                label="Confirmed"
                value={stats.confirmed}
                color="text-green-600"
              />
              <StatCard
                icon={TrendingUp}
                label="Completed"
                value={stats.completed}
                color="text-purple-600"
              />
              <StatCard
                icon={Clock}
                label="Cancelled"
                value={stats.cancelled}
                color="text-red-600"
              />
            </div>

            {/* Queue Management */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Queue Management</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Queue Length
                  </label>
                  <input
                    type="number"
                    value={queueUpdate.queueLength}
                    onChange={(e) => setQueueUpdate(prev => ({
                      ...prev,
                      queueLength: parseInt(e.target.value) || 0
                    }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Wait Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={queueUpdate.currentWaitTime}
                    onChange={(e) => setQueueUpdate(prev => ({
                      ...prev,
                      currentWaitTime: parseInt(e.target.value) || 0
                    }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={updateQueue}
                className="mt-4 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Update Queue Info</span>
              </button>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
                  Today's Appointments
                </h2>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {loading ? (
                <LoadingSpinner message="Loading appointments..." />
              ) : bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Token</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Patient</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Symptoms</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <span className="font-bold text-primary-600">#{booking.tokenNumber}</span>
                          </td>
                          <td className="px-4 py-4">{booking.user?.name}</td>
                          <td className="px-4 py-4">{booking.user?.phone}</td>
                          <td className="px-4 py-4">
                            {booking.slot?.startTime} - {booking.slot?.endTime}
                          </td>
                          <td className="px-4 py-4 max-w-xs truncate">
                            {booking.symptoms || '-'}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No appointments for this date</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
