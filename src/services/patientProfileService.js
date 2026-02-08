/**
 * Patient Profile Service
 * Handles patient profile CRUD operations
 */

import api from './api';

/**
 * Create patient profile
 * @param {Object} profileData - Profile data (fullName, dateOfBirth, gender, contactNumber, emergencyContact)
 * @returns {Promise<Object>} - Created profile
 */
export const createProfile = async (profileData) => {
  try {
    const response = await api.post('/patient-profiles', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create profile' };
  }
};

/**
 * Get current user's patient profile
 * @returns {Promise<Object>} - Patient profile
 */
export const getMyProfile = async () => {
  try {
    const response = await api.get('/patient-profiles/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

/**
 * Update patient profile
 * @param {Object} updates - Fields to update (fullName, gender, contactNumber, emergencyContact)
 * @returns {Promise<Object>} - Updated profile
 */
export const updateProfile = async (updates) => {
  try {
    const response = await api.patch('/patient-profiles/me', updates);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

export default {
  createProfile,
  getMyProfile,
  updateProfile,
};
