/**
 * Authentication service for HABS
 * Handles email-based OTP authentication API calls
 */

import axios from 'axios';

// Base API URL - update if different
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * Send OTP to email address
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Response with success status and message
 * @throws {Error} - Throws error with user-friendly message
 */
export const sendOtp = async (email) => {
  try {
    const response = await authAPI.post('/send-otp', { email });
    return {
      success: true,
      message: response.data.message || 'OTP sent successfully',
      data: response.data,
    };
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Verify OTP and authenticate user
 * @param {string} email - User's email address
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<Object>} - Response with token and user data
 * @throws {Error} - Throws error with user-friendly message
 */
export const verifyOtp = async (email, otp) => {
  try {
    const response = await authAPI.post('/verify-otp', { email, otp });
    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
      message: response.data.message || 'Login successful',
    };
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Update user role
 * @param {string} email - User's email address
 * @param {string} role - User role (PATIENT or HOSPITAL_ADMIN)
 * @returns {Promise<Object>} - Response with token and updated user data
 * @throws {Error} - Throws error with user-friendly message
 */
export const updateRole = async (email, role) => {
  try {
    const response = await authAPI.post('/update-role', { email, role });
    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
      message: response.data.message || 'Role updated successfully',
    };
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Centralized error handler for auth API calls
 * @param {Error} error - Axios error object
 * @returns {Error} - Error with user-friendly message
 */
const handleAuthError = (error) => {
  // Network error
  if (!error.response) {
    return new Error('Network error. Please check your connection and try again.');
  }

  // Server responded with error
  const { status, data } = error.response;

  switch (status) {
    case 400:
      return new Error(data.message || 'Invalid request. Please check your input.');
    case 401:
      return new Error(data.message || 'Invalid OTP. Please try again.');
    case 404:
      return new Error(data.message || 'Service not found.');
    case 429:
      return new Error('Too many attempts. Please try again later.');
    case 500:
      return new Error('Server error. Please try again later.');
    default:
      return new Error(data.message || 'Something went wrong. Please try again.');
  }
};

export default {
  sendOtp,
  verifyOtp,
  updateRole,
};
