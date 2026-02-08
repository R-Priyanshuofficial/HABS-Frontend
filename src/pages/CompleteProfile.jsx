/**
 * CompleteProfile Page - Premium Step-by-Step Wizard
 * Healthcare-focused guided profile completion
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, Phone, Heart, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { createProfile } from '../services/patientProfileService';
import { calculateAge, isValidDateOfBirth } from '../utils/calculateAge';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
  });

  // Redirect if profile already complete
  useEffect(() => {
    if (user?.isProfileComplete) {
      navigate('/');
    }
  }, [user, navigate]);

  // Calculate age when DOB changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth);
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  }, [formData.dateOfBirth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  // Step validation
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.fullName.trim()) {
          toast.error('Please enter your full name');
          return false;
        }
        if (!formData.dateOfBirth) {
          toast.error('Please select your date of birth');
          return false;
        }
        if (!isValidDateOfBirth(formData.dateOfBirth)) {
          toast.error('Please enter a valid date of birth');
          return false;
        }
        return true;
      case 2:
        if (!formData.gender) {
          toast.error('Please select your gender');
          return false;
        }
        return true;
      case 3:
        return true; // Review step, no validation needed
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await createProfile({
        fullName: formData.fullName.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        contactNumber: formData.contactNumber.trim() || undefined,
      });

      // Update user context
      updateUser({ isProfileComplete: true });

      toast.success('Profile completed successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const fadeSlide = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12" style={{ backgroundColor: '#F6F9FC' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[520px] bg-white rounded-2xl shadow-medical p-10"
      >
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of 3
            </span>
            <span className="text-sm font-medium text-primary-500">
              {currentStep === 1 && 'Personal'}
              {currentStep === 2 && 'Medical'}
              {currentStep === 3 && 'Confirm'}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-primary-500 w-14 h-14 rounded-xl mb-4">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentStep === 1 && "Let's set up your health profile"}
            {currentStep === 2 && "Medical basics"}
            {currentStep === 3 && "Review & confirm"}
          </h1>
          <p className="text-gray-600 text-base">
            {currentStep === 1 && "This helps us make booking faster and safer for you"}
            {currentStep === 2 && "Just one more step to personalize your experience"}
            {currentStep === 3 && "Please confirm your details before we proceed"}
          </p>
        </div>

        {/* Steps Content */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Identity */}
            {currentStep === 1 && (
              <motion.div key="step1" {...fadeSlide} className="space-y-6">
                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{user?.email}</span>
                    <span className="text-success text-sm font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full pl-12 pr-4 h-[52px] border-2 border-gray-300 rounded-xl focus:ring-0 focus:border-primary-500 text-base transition-all input-calm"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full pl-12 pr-4 h-[52px] border-2 border-gray-300 rounded-xl focus:ring-0 focus:border-primary-500 text-base transition-all input-calm"
                    />
                  </div>
                  {calculatedAge !== null && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-primary-600 mt-2 font-medium"
                    >
                      Age: {calculatedAge} years
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Medical Basics */}
            {currentStep === 2 && (
              <motion.div key="step2" {...fadeSlide} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Male', 'Female', 'Other'].map((option) => (
                      <motion.button
                        key={option}
                        type="button"
                        onClick={() => handleGenderSelect(option)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`h-[56px] rounded-xl border-2 font-semibold text-base transition-all ${
                          formData.gender === option
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-primary-300 text-gray-700 bg-white'
                        }`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Contact & Confirmation */}
            {currentStep === 3 && (
              <motion.div key="step3" {...fadeSlide} className="space-y-6">
                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number <span className="text-gray-500 text-sm">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full pl-12 pr-4 h-[52px] border-2 border-gray-300 rounded-xl focus:ring-0 focus:border-primary-500 text-base transition-all input-calm"
                    />
                  </div>
                </div>

                {/* Summary Preview */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                    Your Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium text-gray-900">{calculatedAge} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium text-gray-900">{formData.gender}</span>
                    </div>
                    {formData.contactNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-900">{formData.contactNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentStep > 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleBack}
              className="flex-1 h-[52px] border-2 border-gray-300 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all btn-calm"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </motion.button>
          )}
          
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 h-[52px] bg-primary-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 btn-calm transition-all"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 h-[52px] bg-primary-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 btn-calm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Complete Profile
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {currentStep === 3 
            ? "Your information is secure and will only be used for healthcare services"
            : "This information will be used for all your future bookings"
          }
        </p>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
