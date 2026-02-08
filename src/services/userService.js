/**
 * User Service
 * Handles user account operations
 */

import api from './api';

/**
 * Set user role
 * @param {string} role - User role (PATIENT or HOSPITAL_ADMIN)
 * @returns {Promise<Object>} - Response with token and updated user data
 */
export const setRole = async (role) => {
  try {
    const response = await api.post('/users/set-role', { role });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to set role' };
  }
};

/**
 * Get current user
 * @returns {Promise<Object>} - User data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user data' };
  }
};

export default {
  setRole,
  getCurrentUser,
};
