/**
 * Calculate age from date of birth
 * @param {Date|string} dateOfBirth - Date of birth
 * @returns {number|null} - Age in years or null if invalid
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;

  try {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    // Check for invalid or future dates
    if (isNaN(birthDate.getTime()) || birthDate >= today) {
      return null;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Validate reasonable age range
    if (age < 0 || age > 150) {
      return null;
    }

    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return null;
  }
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return '';
  }
};

/**
 * Validate date of birth
 * @param {Date|string} dateOfBirth - Date to validate
 * @returns {boolean} - True if valid
 */
export const isValidDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) return false;

  try {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    // Check if valid date
    if (isNaN(birthDate.getTime())) return false;

    // Must be in the past
    if (birthDate >= today) return false;

    // Check reasonable age range (0-150 years)
    const age = calculateAge(birthDate);
    return age !== null && age >= 0 && age <= 150;
  } catch (error) {
    return false;
  }
};

export default {
  calculateAge,
  formatDate,
  isValidDateOfBirth,
};
