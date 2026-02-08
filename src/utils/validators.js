/**
 * Validation utilities for HABS authentication
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // Standard email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitizes email input (trim and lowercase)
 * @param {string} input - Raw email input
 * @returns {string} - Sanitized email
 */
export const sanitizeEmailInput = (input) => {
  if (!input) return '';
  return input.trim().toLowerCase();
};

/**
 * Validates Indian mobile number format
 * Accepts formats: 9876543210, +919876543210, 919876543210
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const isValidIndianPhone = (phone) => {
  if (!phone) return false;
  
  // Remove spaces and special characters
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Match Indian mobile number patterns
  // Starting with 6-9, followed by 9 digits
  const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
  
  return phoneRegex.test(cleaned);
};

/**
 * Formats phone number to standard format (removes country code)
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted 10-digit number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Remove country code if present (91)
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return cleaned.substring(2);
  }
  
  // Return last 10 digits
  return cleaned.slice(-10);
};

/**
 * Validates OTP format
 * @param {string} otp - OTP to validate
 * @returns {boolean} - True if valid 6-digit OTP
 */
export const isValidOTP = (otp) => {
  if (!otp) return false;
  
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

/**
 * Sanitizes phone input (allows only digits, +, and spaces)
 * @param {string} input - Raw input
 * @returns {string} - Sanitized input
 */
export const sanitizePhoneInput = (input) => {
  if (!input) return '';
  
  // Allow only digits, +, spaces, and hyphens
  return input.replace(/[^\d+\s-]/g, '');
};

/**
 * Validates if input contains only digits
 * @param {string} input - Input to validate
 * @returns {boolean} - True if only digits
 */
export const isNumericOnly = (input) => {
  if (!input) return false;
  return /^\d+$/.test(input);
};
