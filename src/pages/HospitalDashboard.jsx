import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Clock, Calendar, TrendingUp, RefreshCw, 
  Building2, Stethoscope, CheckCircle2, XCircle,
  ChevronRight, Activity, ArrowUpRight, Bell, Settings,
  BarChart3, Zap, AlertCircle, Menu, X, Home,
  CalendarPlus, UserCog, FileText, PieChart, LogOut,
  ChevronDown, Star, MapPin, Phone, Edit3, DollarSign,
  ArrowUp, ArrowDown, Eye, Filter, Mail, Globe, Award,
  Shield, Sparkles, Save, Camera, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingAPI, hospitalAPI, slotAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const HospitalDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);
  const [queueUpdate, setQueueUpdate] = useState({
    queueLength: 0,
    currentWaitTime: 0
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(location.state?.activeSection || 'dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    openTime: '09:00',
    closeTime: '18:00',
    minFee: 200,
    maxFee: 500,
    description: ''
  });

  // Slot management state
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [newSlot, setNewSlot] = useState({
    startTime: '09:00',
    endTime: '10:00',
    capacity: 20,
    isUnlimited: false
  });

  // Get hospital ID from authenticated user (set by backend when role is HOSPITAL_ADMIN)
  const hospitalId = user?.hospitalId || user?.hospital?._id || user?.id;
  const hospitalName = user?.hospitalName || user?.hospital?.name || 'Your Hospital';

  useEffect(() => {
    // Initialize profile data from user
    if (user?.hospital) {
      setProfileData({
        name: user.hospital.name || hospitalName,
        address: user.hospital.address || '123 Healthcare Street, Medical City',
        phone: user.hospital.phone || '+91 9876543210',
        email: user.hospital.email || 'contact@hospital.com',
        website: user.hospital.website || 'www.hospital.com',
        openTime: user.hospital.openTime || '09:00',
        closeTime: user.hospital.closeTime || '18:00',
        minFee: user.hospital.minFee || 200,
        maxFee: user.hospital.maxFee || 500,
        description: user.hospital.description || 'Leading healthcare provider with state-of-the-art facilities.'
      });
    }
  }, [user]);

  useEffect(() => {
    if (hospitalId) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [hospitalId, selectedDate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingAPI.getByHospital(hospitalId, { date: selectedDate });
      if (response.data.success) {
        const bookingData = response.data.data;
        setBookings(bookingData);
        const newStats = {
          total: bookingData.length,
          confirmed: bookingData.filter(b => b.status === 'confirmed').length,
          completed: bookingData.filter(b => b.status === 'completed').length,
          cancelled: bookingData.filter(b => b.status === 'cancelled').length
        };
        setStats(newStats);
        setQueueUpdate({
          queueLength: newStats.confirmed,
          currentWaitTime: newStats.confirmed * 15
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQueue = async () => {
    try {
      await hospitalAPI.updateQueue(hospitalId, queueUpdate);
      toast.success('Queue updated!');
    } catch (error) {
      toast.error('Failed to update queue');
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus}!`);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const handleSaveProfile = async () => {
    try {
      // In real app, call API to update hospital profile
      // await hospitalAPI.updateProfile(hospitalId, profileData);
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  // ============ SLOT MANAGEMENT FUNCTIONS ============
  const isFetchingSlots = useRef(false);
  const lastFetchParams = useRef({ section: '', date: '', hospitalId: '' });

  const fetchSlots = async (force = false) => {
    if (!hospitalId) return;
    
    // Prevent duplicate fetches
    const currentParams = `${activeSection}-${selectedDate}-${hospitalId}`;
    if (!force && (isFetchingSlots.current || lastFetchParams.current === currentParams)) {
      return;
    }
    
    isFetchingSlots.current = true;
    lastFetchParams.current = currentParams;
    setSlotsLoading(true);
    
    try {
      const response = await slotAPI.getByHospital(hospitalId, { date: selectedDate });
      if (response.data.success) {
        setSlots(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setSlotsLoading(false);
      isFetchingSlots.current = false;
    }
  };

  useEffect(() => {
    if (activeSection === 'slots' && hospitalId) {
      fetchSlots();
    }
  }, [activeSection, hospitalId, selectedDate]);

  const handleAddSlot = async () => {
    try {
      const slotData = {
        hospital: hospitalId,
        date: selectedDate,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        capacity: newSlot.isUnlimited ? 9999 : newSlot.capacity,
        isUnlimited: newSlot.isUnlimited
      };
      const response = await slotAPI.create(slotData);
      if (response.data.success) {
        toast.success('Time slot added successfully!');
        setShowAddSlotModal(false);
        setNewSlot({ startTime: '09:00', endTime: '10:00', capacity: 20, isUnlimited: false });
        fetchSlots();
      }
    } catch (error) {
      toast.error('Failed to add time slot');
    }
  };

  // State for delete confirmation modal
  const [deleteModalSlot, setDeleteModalSlot] = useState(null);

  const handleToggleSlot = async (slotId) => {
    // Optimistic update - immediately update UI
    const originalSlots = [...slots];
    setSlots(slots.map(s => 
      s._id === slotId ? { ...s, isActive: !s.isActive } : s
    ));
    
    try {
      const response = await slotAPI.toggle(slotId);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        // Revert on failure
        setSlots(originalSlots);
      }
    } catch (error) {
      // Revert on error
      setSlots(originalSlots);
      toast.error('Failed to toggle slot');
    }
  };

  const handleCloseSlot = async (slotId) => {
    try {
      const response = await slotAPI.close(slotId);
      if (response.data.success) {
        toast.success('Slot marked as closed');
        fetchSlots();
      }
    } catch (error) {
      toast.error('Failed to close slot');
    }
  };

  const handleDeleteSlot = async () => {
    if (!deleteModalSlot) return;
    const slotId = deleteModalSlot._id;
    setDeleteModalSlot(null);
    
    try {
      const response = await slotAPI.delete(slotId);
      if (response.data.success) {
        toast.success('Slot deleted');
        setSlots(slots.filter(s => s._id !== slotId));
      }
    } catch (error) {
      toast.error('Failed to delete slot');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: stats.total },
    { id: 'slots', label: 'Manage Slots', icon: CalendarPlus },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'profile', label: 'Hospital Profile', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // ===================== SIDEBAR COMPONENT =====================
  const Sidebar = () => (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar Panel - Fixed to left edge */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-white">HABS</span>
                    <p className="text-xs text-slate-400">Admin Panel</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Hospital Card */}
            <div className="px-5 py-4">
              <div className="bg-gradient-to-br from-primary-600/30 to-secondary-600/20 border border-primary-500/30 rounded-2xl p-4">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Logged in as</p>
                <p className="text-white font-bold text-lg truncate">{hospitalName}</p>
                <div className="flex items-center mt-3">
                  <span className="flex items-center px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                    <span className="text-emerald-400 text-sm font-medium">Active</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 py-2 overflow-y-auto">
              <p className="px-3 text-xs text-slate-500 uppercase tracking-wider mb-3">Menu</p>
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30' 
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-primary-500/20 text-primary-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </nav>

            {/* Footer Stats */}
            <div className="p-4 border-t border-white/10">
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl p-4 mb-4 shadow-lg">
                <p className="text-white/70 text-xs uppercase tracking-wider mb-3">Today's Summary</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">{stats.completed}</p>
                    <p className="text-white/60 text-xs">Served</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">{stats.confirmed}</p>
                    <p className="text-white/60 text-xs">In Queue</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // ===================== DASHBOARD SECTION =====================
  const DashboardSection = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-primary-500/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
          <p className="text-white/80">Here's what's happening at {hospitalName} today.</p>
          <div className="flex items-center space-x-3 mt-4">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium">{formatDisplayDate(selectedDate)}</span>
            <span className="bg-emerald-500/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium flex items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
              Open Now
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - White Cards with Colored Borders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-lg border-2 border-blue-400"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-emerald-500 text-sm font-medium flex items-center">
              <ArrowUp className="w-3 h-3 mr-1" />12%
            </span>
          </div>
          <p className="text-4xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-gray-500 text-sm mt-1">Total Bookings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 shadow-lg border-2 border-orange-400"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-800">{stats.confirmed}</p>
          <p className="text-gray-500 text-sm mt-1">In Queue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-lg border-2 border-emerald-400"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-800">{stats.completed}</p>
          <p className="text-gray-500 text-sm mt-1">Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-5 shadow-lg border-2 border-purple-400"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-800">{queueUpdate.currentWaitTime}</p>
          <p className="text-gray-500 text-sm mt-1">Avg Wait (min)</p>
        </motion.div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Calendar, label: 'Appointments', color: 'from-blue-500 to-blue-600', section: 'appointments' },
                { icon: CalendarPlus, label: 'Manage Slots', color: 'from-purple-500 to-indigo-500', section: 'slots' },
                { icon: PieChart, label: 'Analytics', color: 'from-emerald-500 to-teal-500', section: 'analytics' },
                { icon: Building2, label: 'Edit Profile', color: 'from-orange-500 to-red-500', section: 'profile' },
              ].map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveSection(item.section)}
                  className={`flex flex-col items-center p-4 bg-gradient-to-br ${item.color} rounded-xl transition-all hover:scale-105 hover:shadow-lg group`}
                >
                  <item.icon className="w-8 h-8 text-white mb-2" />
                  <span className="text-sm font-medium text-white">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Recent Appointments Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Recent Appointments</h3>
              <button 
                onClick={() => setActiveSection('appointments')}
                className="text-primary-600 text-sm font-medium hover:underline flex items-center"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            {bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking, idx) => (
                  <div key={booking._id || idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                        #{booking.tokenNumber || idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{booking.user?.name || 'Patient'}</p>
                        <p className="text-sm text-gray-500">{booking.slot?.startTime || '-'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                      booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No appointments today</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar - Queue Management */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Queue Management</h3>
                  <p className="text-white/70 text-xs">Update real-time info</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Queue Length</label>
                <input
                  type="number"
                  value={queueUpdate.queueLength}
                  onChange={(e) => setQueueUpdate(prev => ({ ...prev, queueLength: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wait Time (min)</label>
                <input
                  type="number"
                  value={queueUpdate.currentWaitTime}
                  onChange={(e) => setQueueUpdate(prev => ({ ...prev, currentWaitTime: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
              <button
                onClick={updateQueue}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Update Queue</span>
              </button>
            </div>
          </motion.div>

          {/* Live Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-5 shadow-lg"
          >
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <h3 className="font-bold text-white">Live Status</h3>
            </div>
            <p className="text-white/80 text-sm">Hospital is visible to patients and accepting bookings.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );

  // ===================== APPOINTMENTS SECTION =====================
  const AppointmentsSection = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-500 px-6 py-5 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Appointments</h2>
            <p className="text-white/80">Manage all patient appointments</p>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none"
          />
        </div>
      </div>
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', count: stats.total },
            { key: 'confirmed', label: 'Confirmed', count: stats.confirmed },
            { key: 'completed', label: 'Completed', count: stats.completed },
            { key: 'cancelled', label: 'Cancelled', count: stats.cancelled },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key ? 'bg-primary-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <LoadingSpinner message="Loading appointments..." />
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-3">
            {filteredBookings.map((booking, idx) => (
              <div key={booking._id || idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border hover:shadow-md transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    #{booking.tokenNumber || idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{booking.user?.name || 'Patient'}</p>
                    <p className="text-sm text-gray-500">{booking.user?.phone || '-'} • {booking.slot?.startTime || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                    booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>{booking.status}</span>
                  {booking.status === 'confirmed' && (
                    <div className="flex space-x-2">
                      <button onClick={() => updateBookingStatus(booking._id, 'completed')} className="px-3 py-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 text-sm font-medium">Complete</button>
                      <button onClick={() => updateBookingStatus(booking._id, 'cancelled')} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Appointments</h3>
            <p className="text-gray-500">{activeTab === 'all' ? 'No appointments for this date' : `No ${activeTab} appointments`}</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  // ===================== PROFILE SECTION - IMPROVED =====================
  const ProfileSection = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 rounded-3xl overflow-hidden shadow-xl relative">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Hospital Avatar */}
            <div className="relative">
              <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-4 border-white/30 shadow-xl">
                <Building2 className="w-14 h-14 text-white" />
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-5 h-5 text-primary-600" />
              </button>
            </div>

            {/* Hospital Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{profileData.name || hospitalName}</h1>
                <span className="px-3 py-1 bg-emerald-500/30 rounded-full text-emerald-100 text-sm font-medium flex items-center">
                  <Shield className="w-4 h-4 mr-1" /> Verified
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <span className="flex items-center"><Star className="w-4 h-4 text-yellow-400 fill-current mr-1" /> 4.8 Rating</span>
                <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> 500+ Patients</span>
                <span className="flex items-center"><Award className="w-4 h-4 mr-1" /> Top Rated</span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                isEditingProfile 
                  ? 'bg-white/20 text-white border-2 border-white/50' 
                  : 'bg-white text-primary-600 hover:shadow-xl'
              }`}
            >
              <Edit3 className="w-5 h-5" />
              <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-primary-500" /> Contact Information
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {isEditingProfile ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">{profileData.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{profileData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{profileData.email}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary-500" /> Business Details
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {isEditingProfile ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opens At</label>
                    <input
                      type="time"
                      value={profileData.openTime}
                      onChange={(e) => setProfileData(prev => ({ ...prev, openTime: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Closes At</label>
                    <input
                      type="time"
                      value={profileData.closeTime}
                      onChange={(e) => setProfileData(prev => ({ ...prev, closeTime: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Fee (₹)</label>
                    <input
                      type="number"
                      value={profileData.minFee}
                      onChange={(e) => setProfileData(prev => ({ ...prev, minFee: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Fee (₹)</label>
                    <input
                      type="number"
                      value={profileData.maxFee}
                      onChange={(e) => setProfileData(prev => ({ ...prev, maxFee: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={profileData.description}
                    onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none resize-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Working Hours</p>
                    <p className="font-medium text-gray-800">{profileData.openTime} - {profileData.closeTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Consultation Fee</p>
                    <p className="text-2xl font-bold text-gray-800">₹{profileData.minFee} - ₹{profileData.maxFee}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-2">About</p>
                  <p className="text-gray-700">{profileData.description}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditingProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end space-x-4"
        >
          <button
            onClick={() => setIsEditingProfile(false)}
            className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold flex items-center space-x-2 hover:shadow-lg transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );

  // Other sections (simplified)
  const SlotsSection = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <CalendarPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Manage Time Slots</h2>
              <p className="text-gray-500 text-sm">Create and edit appointment slots for {formatDisplayDate(selectedDate)}</p>
            </div>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
          />
        </div>

        {/* Add New Slot Button */}
        <button
          onClick={() => navigate('/add-time-slot')}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-all group"
        >
          <CalendarPlus className="w-10 h-10 text-gray-400 group-hover:text-primary-500 mx-auto mb-2 transition-colors" />
          <p className="text-gray-600 group-hover:text-primary-600 font-medium transition-colors">Add New Time Slot</p>
        </button>
      </div>

      {/* Slots List */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Today's Time Slots</h3>
        
        {slotsLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-2">Loading slots...</p>
          </div>
        ) : slots.length > 0 ? (
          <div className="space-y-3">
            {slots.map((slot) => (
              <div 
                key={slot._id} 
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  slot.status === 'closed' 
                    ? 'bg-gray-100 border-gray-300 opacity-60' 
                    : slot.isActive 
                      ? 'bg-white border-emerald-200' 
                      : 'bg-orange-50 border-orange-200'
                }`}
              >
                {/* Time & Status */}
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    slot.status === 'closed' ? 'bg-gray-200' :
                    slot.isActive ? 'bg-emerald-100' : 'bg-orange-100'
                  }`}>
                    <Clock className={`w-6 h-6 ${
                      slot.status === 'closed' ? 'text-gray-500' :
                      slot.isActive ? 'text-emerald-600' : 'text-orange-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{slot.startTime} - {slot.endTime}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {slot.status === 'closed' ? (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">Closed</span>
                      ) : slot.isActive ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Inactive</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Capacity */}
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {slot.isUnlimited ? '∞' : slot.capacity}
                  </p>
                  <p className="text-xs text-gray-500">
                    {slot.isUnlimited ? 'Unlimited' : 'Max Patients'}
                  </p>
                </div>

                {/* Available */}
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {slot.isUnlimited ? '∞' : slot.availableCount}
                  </p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>

                {/* Toggle & Actions */}
                <div className="flex items-center space-x-3">
                  {/* Toggle Switch */}
                  {slot.status !== 'closed' && (
                    <button
                      onClick={() => handleToggleSlot(slot._id)}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        slot.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        slot.isActive ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteModalSlot(slot)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete slot"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Time Slots</h3>
            <p className="text-gray-500">Add your first time slot to start accepting appointments.</p>
          </div>
        )}
      </div>
    </div>
  );

  const AnalyticsSection = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Key Metrics */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Analytics Overview</h2>
              <p className="text-gray-500 text-sm">Track your performance</p>
            </div>
          </div>
          <select className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium focus:border-primary-500 focus:outline-none">
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '156', label: 'Total Appointments', color: 'blue', icon: Calendar },
            { value: '89%', label: 'Success Rate', color: 'emerald', icon: CheckCircle2 },
            { value: '4.8', label: 'Patient Rating', color: 'purple', icon: Star },
            { value: '12m', label: 'Avg Wait Time', color: 'orange', icon: Clock },
          ].map((item, idx) => (
            <div key={idx} className={`bg-white rounded-xl p-4 border-2 border-${item.color}-400 shadow-md`}>
              <div className={`w-10 h-10 bg-${item.color}-50 rounded-lg flex items-center justify-center mb-3`}>
                <item.icon className={`w-5 h-5 text-${item.color}-600`} />
              </div>
              <p className="text-3xl font-bold text-gray-800">{item.value}</p>
              <p className="text-gray-500 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Appointments Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Appointments</h3>
          <div className="space-y-3">
            {[
              { day: 'Monday', count: 24, percent: 80 },
              { day: 'Tuesday', count: 30, percent: 100 },
              { day: 'Wednesday', count: 18, percent: 60 },
              { day: 'Thursday', count: 27, percent: 90 },
              { day: 'Friday', count: 22, percent: 73 },
              { day: 'Saturday', count: 15, percent: 50 },
              { day: 'Sunday', count: 8, percent: 27 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <span className="w-20 text-sm text-gray-600">{item.day}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                  />
                </div>
                <span className="w-8 text-sm font-bold text-gray-700">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Peak Hours</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { time: '9 AM', level: 'medium' },
              { time: '10 AM', level: 'high' },
              { time: '11 AM', level: 'high' },
              { time: '12 PM', level: 'medium' },
              { time: '1 PM', level: 'low' },
              { time: '2 PM', level: 'medium' },
              { time: '3 PM', level: 'high' },
              { time: '4 PM', level: 'high' },
              { time: '5 PM', level: 'medium' },
              { time: '6 PM', level: 'low' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className={`h-16 rounded-lg mb-2 flex items-end justify-center ${
                  item.level === 'high' ? 'bg-red-100' : 
                  item.level === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <div className={`w-full rounded-lg ${
                    item.level === 'high' ? 'h-full bg-red-400' : 
                    item.level === 'medium' ? 'h-2/3 bg-yellow-400' : 'h-1/3 bg-green-400'
                  }`} />
                </div>
                <span className="text-xs text-gray-600">{item.time}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <span className="text-sm text-gray-600">Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <span className="text-sm text-gray-600">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <span className="text-sm text-gray-600">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Demographics */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Patient Age Groups</h3>
          <div className="space-y-4">
            {[
              { group: '0-18 years', percent: 15, color: 'bg-blue-500' },
              { group: '19-35 years', percent: 35, color: 'bg-emerald-500' },
              { group: '36-55 years', percent: 30, color: 'bg-purple-500' },
              { group: '56+ years', percent: 20, color: 'bg-orange-500' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.group}</span>
                  <span className="font-bold text-gray-800">{item.percent}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Types */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Appointment Types</h3>
          <div className="space-y-3">
            {[
              { type: 'General Checkup', count: 45, icon: Stethoscope, color: 'blue' },
              { type: 'Follow-up', count: 28, icon: RefreshCw, color: 'emerald' },
              { type: 'Emergency', count: 12, icon: Zap, color: 'red' },
              { type: 'Consultation', count: 35, icon: Users, color: 'purple' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                  </div>
                  <span className="font-medium text-gray-700">{item.type}</span>
                </div>
                <span className="text-lg font-bold text-gray-800">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New booking received', time: '2 min ago', type: 'booking' },
              { action: 'Appointment completed', time: '15 min ago', type: 'complete' },
              { action: 'Patient cancelled', time: '1 hour ago', type: 'cancel' },
              { action: 'New booking received', time: '2 hours ago', type: 'booking' },
              { action: 'Queue updated', time: '3 hours ago', type: 'update' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  item.type === 'booking' ? 'bg-blue-500' :
                  item.type === 'complete' ? 'bg-emerald-500' :
                  item.type === 'cancel' ? 'bg-red-500' : 'bg-gray-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.action}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const SettingsSection = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <p className="text-gray-500 text-sm">Manage preferences</p>
        </div>
      </div>
      <div className="space-y-4">
        {[
          { label: 'Notifications', desc: 'Booking alerts', on: true },
          { label: 'SMS Alerts', desc: 'Patient SMS', on: false },
          { label: 'Email Reports', desc: 'Daily summary', on: true },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-800">{s.label}</p>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </div>
            <div className={`w-12 h-6 rounded-full ${s.on ? 'bg-primary-500' : 'bg-gray-300'} relative cursor-pointer`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all ${s.on ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'appointments': return <AppointmentsSection />;
      case 'slots': return <SlotsSection />;
      case 'analytics': return <AnalyticsSection />;
      case 'profile': return <ProfileSection />;
      case 'settings': return <SettingsSection />;
      default: return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/50 to-indigo-50/30">
      <Sidebar />

      {/* Premium Header with Decorative Elements */}
      <header className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-white/5 rounded-full" />
        
        {/* Floating Icons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute top-4 right-8 hidden lg:block"
        >
          <Stethoscope className="w-32 h-32 text-white" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm border border-white/10"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              <div>
                <p className="text-white/70 text-sm">{getGreeting()}</p>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  {hospitalName}
                  <Sparkles className="w-5 h-5 ml-2 text-yellow-300" />
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="hidden md:flex items-center px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-xl border border-emerald-400/30">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                <span className="text-emerald-100 font-medium">Open Now</span>
              </span>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm border border-white/10 relative">
                <Bell className="w-5 h-5 text-white" />
                {stats.confirmed > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold animate-pulse">{stats.confirmed}</span>
                )}
              </button>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex items-center space-x-2 mt-5 overflow-x-auto pb-2">
            {menuItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeSection === item.id
                      ? 'bg-white text-primary-600 shadow-xl shadow-black/10'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderSection()}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalSlot && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModalSlot(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-[201] p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                {/* Icon */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Delete Time Slot?
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete the slot{' '}
                  <span className="font-semibold">{deleteModalSlot.startTime} - {deleteModalSlot.endTime}</span>?
                  This action cannot be undone.
                </p>
                
                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModalSlot(null)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteSlot}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HospitalDashboard;
