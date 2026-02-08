/**
 * AuthContext - Global authentication state management for HABS
 */

import React, { createContext, useState, useEffect } from 'react';

// Create AuthContext
export const AuthContext = createContext(null);

// Local storage keys
const TOKEN_KEY = 'habs_auth_token';
const USER_KEY = 'habs_auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore auth state on mount
  useEffect(() => {
    restoreAuthState();
  }, []);

  /**
   * Restore authentication state from localStorage
   */
  const restoreAuthState = () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user and save auth state
   * @param {string} authToken - JWT token
   * @param {Object} userData - User object with role, phone, etc.
   */
  const login = (authToken, userData) => {
    try {
      // Save to state
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);

      // Persist to localStorage
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      throw new Error('Failed to save authentication data');
    }
  };

  /**
   * Logout user and clear all auth state
   */
  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  /**
   * Get user's role
   * @returns {string|null} - User role or null
   */
  const getRole = () => {
    return user?.role || null;
  };

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean} - True if user has the role
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Update user data (e.g., after profile completion)
   * @param {Object} updates - User data updates
   */
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  // Context value
  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    role: getRole(),
    isProfileComplete: user?.isProfileComplete || false,
    login,
    logout,
    hasRole,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
