/**
 * OTPModal - 6-digit OTP input component
 * Features: Auto-focus, keyboard navigation, resend timer
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isValidOTP } from '../utils/validators';

const OTPModal = ({ isOpen, onClose, email, onVerify, onResend }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Timer for resend OTP
  useEffect(() => {
    if (isOpen && resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setResendTimer(30);
      setCanResend(false);
      // Auto-focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  /**
   * Handle OTP input change
   */
  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle backspace key
   */
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Focus previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  /**
   * Handle paste event
   */
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  /**
   * Handle OTP submission
   */
  const handleSubmit = async () => {
    const otpValue = otp.join('');

    if (!isValidOTP(otpValue)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onVerify(otpValue);
      // Success - modal will be closed by parent
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']); // Clear OTP on error
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle resend OTP
   */
  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');
    setOtp(['', '', '', '', '', '']);

    try {
      await onResend();
      setResendTimer(30);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Check if OTP is complete
  const isOtpComplete = otp.every((digit) => digit !== '');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Enter OTP</h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            We've sent a 6-digit code to{' '}
            <span className="font-semibold text-gray-900">{email}</span>
          </p>

          {/* OTP Inputs */}
          <div className="flex gap-2 sm:gap-3 mb-6 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={loading}
                className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all ${
                  digit
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 bg-white'
                } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-600 text-center">{error}</p>
            </motion.div>
          )}

          {/* Verify Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={!isOtpComplete || loading}
            whileHover={{ scale: !isOtpComplete || loading ? 1 : 1.02 }}
            whileTap={{ scale: !isOtpComplete || loading ? 1 : 0.98 }}
            className={`w-full bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-4 shadow-lg ${
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
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify OTP</span>
            )}
          </motion.button>

          {/* Resend OTP */}
          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-primary-600 font-medium hover:text-primary-700 transition-colors disabled:opacity-50 inline-flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Resend OTP</span>
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Resend OTP in{' '}
                <span className="font-semibold text-primary-600">{resendTimer}s</span>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OTPModal;
