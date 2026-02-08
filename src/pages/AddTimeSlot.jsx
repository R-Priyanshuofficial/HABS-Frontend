import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Calendar,
  CalendarPlus,
  Plus,
  Trash2,
  Copy,
  Save,
  CheckCircle2,
  Info,
  Repeat,
  Zap,
  Settings,
  Eye
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { slotAPI } from '../services/api';

const AddTimeSlot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Form state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([
    { id: 1, startTime: '09:00', endTime: '10:00', capacity: 20, isUnlimited: false }
  ]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState([]);
  const [recurringWeeks, setRecurringWeeks] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Get hospital ID - Use hospitalId from user (linked in backend)
  const getHospitalId = () => {
    // Debug: log user object to console
    console.log('User object for hospital ID:', user);
    
    // Primary: use hospitalId field from user (set by backend when role is HOSPITAL_ADMIN)
    if (user?.hospitalId) {
      return user.hospitalId;
    }
    
    // Fallbacks
    return user?.hospital?._id || user?.id || user?._id;
  };

  const hospitalId = getHospitalId();

  // Days of the week
  const weekDays = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' }
  ];

  // Preset templates
  const presetTemplates = [
    { name: 'Morning Session', slots: [{ startTime: '09:00', endTime: '12:00', capacity: 30 }] },
    { name: 'Afternoon Session', slots: [{ startTime: '14:00', endTime: '17:00', capacity: 25 }] },
    { name: 'Full Day', slots: [
      { startTime: '09:00', endTime: '12:00', capacity: 30 },
      { startTime: '14:00', endTime: '17:00', capacity: 25 }
    ]},
    { name: 'Evening Clinic', slots: [{ startTime: '18:00', endTime: '21:00', capacity: 20 }] }
  ];

  // Quick capacity options
  const capacityOptions = [5, 10, 15, 20, 25, 30, 50];

  // Add new slot
  const addSlot = () => {
    const lastSlot = slots[slots.length - 1];
    const newStartTime = lastSlot ? lastSlot.endTime : '09:00';
    const [hours] = newStartTime.split(':');
    const newEndHour = (parseInt(hours) + 1).toString().padStart(2, '0');
    const newEndTime = `${newEndHour}:00`;
    
    setSlots([...slots, {
      id: Date.now(),
      startTime: newStartTime,
      endTime: newEndTime,
      capacity: 20,
      isUnlimited: false
    }]);
  };

  // Remove slot
  const removeSlot = (id) => {
    if (slots.length > 1) {
      setSlots(slots.filter(s => s.id !== id));
    }
  };

  // Duplicate slot
  const duplicateSlot = (slot) => {
    setSlots([...slots, { ...slot, id: Date.now() }]);
  };

  // Update slot
  const updateSlot = (id, field, value) => {
    setSlots(slots.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  // Apply template
  const applyTemplate = (template) => {
    setSlots(template.slots.map((s, i) => ({
      ...s,
      id: Date.now() + i,
      isUnlimited: false
    })));
  };

  // Toggle recurring day
  const toggleRecurringDay = (day) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter(d => d !== day));
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };

  // Format time for display
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Calculate total patients
  const getTotalPatients = () => {
    return slots.reduce((total, slot) => {
      if (slot.isUnlimited) return total;
      return total + slot.capacity;
    }, 0);
  };

  // Handle manual capacity input
  const handleCapacityChange = (id, value) => {
    const numValue = parseInt(value) || 1;
    const clampedValue = Math.max(1, Math.min(999, numValue));
    updateSlot(id, 'capacity', clampedValue);
  };

  // Navigate back to Manage Slots section
  const handleBack = () => {
    navigate('/hospital-dashboard', { state: { activeSection: 'slots' } });
  };

  // Submit slots
  const handleSubmit = async () => {
    if (!hospitalId) {
      console.error('User object:', user);
      toast.error('Hospital ID not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create slots for the selected date
      const createdSlots = [];
      
      for (const slot of slots) {
        const slotData = {
          hospital: hospitalId,
          date: selectedDate,
          startTime: slot.startTime,
          endTime: slot.endTime,
          capacity: slot.isUnlimited ? 9999 : slot.capacity,
          availableCount: slot.isUnlimited ? 9999 : slot.capacity,
          isUnlimited: slot.isUnlimited,
          isActive: true
        };
        
        const response = await slotAPI.create(slotData);
        createdSlots.push(response.data);
      }

      toast.success(`${createdSlots.length} time slot(s) created successfully!`);
      navigate('/hospital-dashboard', { state: { activeSection: 'slots' } });
    } catch (error) {
      console.error('Error creating slots:', error);
      toast.error(error.response?.data?.message || 'Failed to create time slots');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Add Time Slots</h1>
                <p className="text-sm text-gray-500">Create appointment availability</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Slots
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Date Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Select Date</h2>
                  <p className="text-sm text-gray-500">Choose when slots should be available</p>
                </div>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none font-medium text-gray-800"
              />
            </div>

            {/* Quick Templates */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Quick Templates</h2>
                  <p className="text-sm text-gray-500">Apply preset slot configurations</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presetTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => applyTemplate(template)}
                    className="p-3 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                  >
                    <span className="text-sm font-semibold text-gray-700">{template.name}</span>
                    <span className="text-xs text-gray-500 block mt-1">
                      {template.slots.length} slot(s)
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Time Slots</h2>
                    <p className="text-sm text-gray-500">{slots.length} slot(s) configured</p>
                  </div>
                </div>
                <button
                  onClick={addSlot}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Slot
                </button>
              </div>

              <div className="space-y-4">
                {slots.map((slot, index) => (
                  <div
                    key={slot.id}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-400">SLOT {index + 1}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => duplicateSlot(slot)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {slots.length > 1 && (
                          <button
                            onClick={() => removeSlot(slot.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Start Time</label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateSlot(slot.id, 'startTime', e.target.value)}
                          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">End Time</label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateSlot(slot.id, 'endTime', e.target.value)}
                          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 mb-2 block">Patient Capacity</label>
                      <div className="flex items-center gap-2">
                        {/* Manual Input Field */}
                        <input
                          type="number"
                          min="1"
                          max="999"
                          value={slot.isUnlimited ? '' : slot.capacity}
                          onChange={(e) => handleCapacityChange(slot.id, e.target.value)}
                          disabled={slot.isUnlimited}
                          placeholder="Enter"
                          className={`w-20 px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-medium text-center ${
                            slot.isUnlimited ? 'bg-gray-100 text-gray-400' : ''
                          }`}
                        />
                        <div className="flex flex-wrap gap-1.5 flex-1">
                          {capacityOptions.map((cap) => (
                            <button
                              key={cap}
                              onClick={() => updateSlot(slot.id, 'capacity', cap)}
                              disabled={slot.isUnlimited}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                slot.capacity === cap && !slot.isUnlimited
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              } ${slot.isUnlimited ? 'opacity-40' : ''}`}
                            >
                              {cap}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => updateSlot(slot.id, 'isUnlimited', !slot.isUnlimited)}
                          className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 ${
                            slot.isUnlimited
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span className="text-lg">∞</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recurring Options */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Repeat className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Repeat Schedule</h2>
                    <p className="text-sm text-gray-500">Create recurring slots</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRecurring(!isRecurring)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isRecurring
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isRecurring ? 'Enabled' : 'Enable'}
                </button>
              </div>

              {isRecurring && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Repeat on days</label>
                    <div className="flex gap-2">
                      {weekDays.map((day) => (
                        <button
                          key={day.key}
                          onClick={() => toggleRecurringDay(day.key)}
                          className={`w-10 h-10 rounded-lg font-medium text-sm ${
                            recurringDays.includes(day.key)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">For how many weeks?</label>
                    <div className="flex gap-2">
                      {[1, 2, 4, 8, 12].map((weeks) => (
                        <button
                          key={weeks}
                          onClick={() => setRecurringWeeks(weeks)}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            recurringWeeks === weeks
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {weeks} {weeks === 1 ? 'week' : 'weeks'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Preview & Summary */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('en-IN', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Slots</span>
                  <span className="font-semibold text-gray-900">{slots.length}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Capacity</span>
                  <span className="font-semibold text-gray-900">
                    {slots.some(s => s.isUnlimited) ? '∞ Unlimited' : getTotalPatients()}
                  </span>
                </div>

                {isRecurring && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Recurring</span>
                    <span className="font-semibold text-gray-900">{recurringWeeks} week(s)</span>
                  </div>
                )}
              </div>

              {/* Slot Preview */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Slots Preview</h4>
                <div className="space-y-2">
                  {slots.map((slot, index) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-800">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {slot.isUnlimited ? '∞' : slot.capacity} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Create {slots.length} Slot(s)
                  </>
                )}
              </button>

              {/* Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Slots will be immediately available for patient bookings after creation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTimeSlot;
