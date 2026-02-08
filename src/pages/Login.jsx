/**
 * Login Page - Email-based OTP authentication
 * Entry point for user authentication
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Loader2, Shield, CheckCircle, Activity } from 'lucide-react';
import { toast } from 'react-toastify';
import OTPModal from '../components/OTPModal';
import { useAuth } from '../hooks/useAuth';
import { sendOtp, verifyOtp } from '../services/authService';
import { isValidEmail, sanitizeEmailInput } from '../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);

  /**
   * Handle email input change
   */
  const handleEmailChange = (e) => {
    const sanitized = sanitizeEmailInput(e.target.value);
    setEmail(sanitized);
    setError(''); // Clear error on input
  };

  /**
   * Handle send OTP
   */
  const handleSendOTP = async (e) => {
    e.preventDefault();

    // Validate email
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendOtp(email);
      
      toast.success('OTP sent successfully to your email!');
      setShowOTPModal(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle OTP verification
   */
  const handleVerifyOTP = async (otp) => {
    try {
      const response = await verifyOtp(email, otp);
      
      // Save auth state
      login(response.token, response.user);
      
      toast.success('Login successful!');
      setShowOTPModal(false);

      // Role-based redirection
      handleRedirect(response.user.role);
    } catch (err) {
      throw err; // Let OTPModal handle the error display
    }
  };

  /**
   * Handle resend OTP
   */
  const handleResendOTP = async () => {
    try {
      await sendOtp(email);
      toast.success('OTP resent successfully to your email!');
    } catch (err) {
      throw err; // Let OTPModal handle the error display
    }
  };

  /**
   * Handle role-based redirect after login
   */
  const handleRedirect = (role) => {
    if (!role) {
      navigate('/select-role');
    } else if (role === 'PATIENT') {
      navigate('/');
    } else if (role === 'HOSPITAL_ADMIN') {
      navigate('/hospital-dashboard');
    } else {
      navigate('/');
    }
  };

  // Why Choose HABS Features
  const features = [
    { 
      icon: Shield, 
      text: 'Secure OTP-based login',
      color: 'primary',
      delay: 0.7 
    },
    { 
      icon: CheckCircle, 
      text: 'Skip hospital queues',
      color: 'secondary',
      delay: 0.8 
    },
    { 
      icon: Heart, 
      text: 'Book appointments instantly',
      color: 'accent',
      delay: 0.9 
    },
    { 
      icon: Activity, 
      text: '24/7 healthcare access',
      color: 'primary',
      delay: 1.0 
    },
  ];

  return (
    <div className="min-h-screen medical-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Shapes - Optimized */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ willChange: 'opacity' }}
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-96 h-96 bg-primary-200 rounded-full blur-2xl opacity-30"
          style={{ willChange: 'transform' }}
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.08, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-secondary-200 rounded-full blur-2xl opacity-30"
          style={{ willChange: 'transform' }}
        />
      </motion.div>

      {/* Main Content Container - Responsive Layout */}
      <div className="w-full max-w-7xl relative z-10">
        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:flex lg:items-start lg:justify-center lg:gap-12">
          {/* Login Section - Slides from center to left */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              type: "spring",
              stiffness: 80,
              damping: 15
            }}
            className="w-full max-w-md"
          >
            {/* Logo & Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              className="text-center mb-4"
            >
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.5, 
                  duration: 0.7,
                  type: "spring",
                  stiffness: 200,
                  damping: 12
                }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="inline-flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600 w-14 h-14 rounded-2xl mb-3 shadow-2xl"
              >
                <Heart className="w-7 h-7 text-white" fill="white" />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-2xl font-bold text-gray-900 mb-1"
              >
                Welcome to HABS
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-gray-600 text-sm"
              >
                Healthcare Appointment Booking System
              </motion.p>
            </motion.div>

            {/* Login Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.5, 
                duration: 0.7,
                type: "spring",
                stiffness: 100
              }}
              className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-1">Login</h2>
              <p className="text-gray-600 text-sm mb-5">Enter your email to continue</p>

              <form onSubmit={handleSendOTP}>
                {/* Email Input */}
                <div className="mb-5">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                      <Mail className="w-5 h-5 text-primary-500" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="you@example.com"
                      disabled={loading}
                      className={`w-full pl-14 pr-5 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-300 ${
                        error
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
                      } disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-medium`}
                    />
                  </div>
                  
                  {/* Error Message */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 text-sm text-red-600 flex items-center space-x-2 font-medium"
                    >
                      <span>⚠</span>
                      <span>{error}</span>
                    </motion.p>
                  )}
                </div>

                {/* Send OTP Button */}
                <motion.button
                  whileHover={{ scale: loading || !email ? 1 : 1.03 }}
                  whileTap={{ scale: loading || !email ? 1 : 0.97 }}
                  type="submit"
                  disabled={loading || !email}
                  className={`w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-2xl font-bold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl ${
                    loading ? 'animate-pulse' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-6 h-6" />
                      </motion.div>
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Footer */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-center text-xs text-gray-500 mt-4 leading-relaxed"
            >
              By continuing, you agree to our{' '}
              <span className="text-primary-600 font-semibold cursor-pointer hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-primary-600 font-semibold cursor-pointer hover:underline">Privacy Policy</span>
            </motion.p>
          </motion.div>

          {/* Why Choose HABS - Slides in from right on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 150 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.5,
              type: "spring",
              stiffness: 80,
              damping: 15
            }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Why Choose HABS?</h3>
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Activity className="w-5 h-5 text-secondary-500" />
                </motion.div>
              </div>

              <div className="space-y-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const colorClass = {
                    primary: 'bg-primary-100 text-primary-600',
                    secondary: 'bg-secondary-100 text-secondary-600',
                    accent: 'bg-accent-100 text-accent-600',
                  }[feature.color];

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        delay: feature.delay,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 120
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        x: 8,
                        transition: { duration: 0.2 }
                      }}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all cursor-pointer group"
                    >
                      <motion.div 
                        whileHover={{ rotate: 360, scale: 1.15 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className={`p-2 rounded-lg ${colorClass} shadow-md group-hover:shadow-lg`}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{feature.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <p className="text-xs text-gray-500 text-center font-medium mb-3">
                  Trusted by thousands of patients across India
                </p>
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
                  className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full shadow-lg"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Tablet & Mobile Layout - Stacked vertically */}
        <div className="lg:hidden flex flex-col items-center">
          {/* Login Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.7, 
              delay: 0.1,
              type: "spring",
              stiffness: 100
            }}
            className="w-full max-w-md"
          >
            {/* Logo & Header */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 150 }}
              className="text-center mb-4"
            >
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.4, 
                  duration: 0.7,
                  type: "spring",
                  stiffness: 200,
                  damping: 12
                }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="inline-flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600 w-14 h-14 rounded-2xl mb-3 shadow-2xl"
              >
                <Heart className="w-7 h-7 text-white" fill="white" />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-1"
              >
                Welcome to HABS
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-gray-600 text-sm"
              >
                Healthcare Appointment Booking System
              </motion.p>
            </motion.div>

            {/* Login Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.4, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              className="bg-white rounded-2xl shadow-2xl p-5 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-1">Login</h2>
              <p className="text-gray-600 text-sm mb-4">Enter your email to continue</p>

              <form onSubmit={handleSendOTP}>
                {/* Email Input */}
                <div className="mb-4">
                  <label htmlFor="email-mobile" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Mail className="w-5 h-5 text-primary-500" />
                    </div>
                    <input
                      id="email-mobile"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="you@example.com"
                      disabled={loading}
                      className={`w-full pl-14 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-300 ${
                        error
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
                      } disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-medium`}
                    />
                  </div>
                  
                  {/* Error Message */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 text-sm text-red-600 flex items-center space-x-1 font-medium"
                    >
                      <span>⚠</span>
                      <span>{error}</span>
                    </motion.p>
                  )}
                </div>

                {/* Send OTP Button */}
                <motion.button
                  whileHover={{ scale: loading || !email ? 1 : 1.03 }}
                  whileTap={{ scale: loading || !email ? 1 : 0.97 }}
                  type="submit"
                  disabled={loading || !email}
                  className={`w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-2xl font-bold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl ${
                    loading ? 'animate-pulse' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-5 h-5" />
                      </motion.div>
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Footer */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-center text-xs text-gray-500 mt-4"
            >
              By continuing, you agree to our{' '}
              <span className="text-primary-600 font-semibold cursor-pointer hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-primary-600 font-semibold cursor-pointer hover:underline">Privacy Policy</span>
            </motion.p>
          </motion.div>

          {/* Why Choose HABS - Appears below on tablet/mobile */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.7, 
              delay: 0.6,
              type: "spring",
              stiffness: 100
            }}
            className="w-full max-w-md mt-6"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">Why Choose HABS?</h3>
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Activity className="w-5 h-5 text-secondary-500" />
                </motion.div>
              </div>

              <div className="space-y-2">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const colorClass = {
                    primary: 'bg-primary-100 text-primary-600',
                    secondary: 'bg-secondary-100 text-secondary-600',
                    accent: 'bg-accent-100 text-accent-600',
                  }[feature.color];

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        delay: 0.7 + (index * 0.1),
                        duration: 0.5,
                        type: "spring",
                        stiffness: 120
                      }}
                      whileHover={{ 
                        scale: 1.03, 
                        x: 5,
                        transition: { duration: 0.2 }
                      }}
                      className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all cursor-pointer group"
                    >
                      <motion.div 
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`p-2 rounded-lg ${colorClass} shadow-md group-hover:shadow-lg`}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.div>
                      <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">{feature.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mt-3 pt-3 border-t border-gray-200"
              >
                <p className="text-xs text-gray-500 text-center font-medium mb-2">
                  Trusted by thousands of patients across India
                </p>
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
                  className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full shadow-lg"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={email}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
      />
    </div>
  );
};

export default Login;
