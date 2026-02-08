/**
 * ProtectedRoute - Wrapper component to protect routes that require authentication
 * Implements smart routing based on user state and role:
 * - No auth → login
 * - No role → select-role  
 * - PATIENT without profile → complete-profile
 * - PATIENT accessing hospital routes → redirect to home
 * - HOSPITAL_ADMIN accessing patient routes → redirect to dashboard
 * - Otherwise → allow access
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

// Routes only for patients
const PATIENT_ONLY_ROUTES = ['/my-bookings', '/booking'];

// Routes only for hospital admins
const HOSPITAL_ADMIN_ROUTES = ['/hospital-dashboard'];

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow access to select-role and complete-profile pages
  const publicAuthPages = ['/select-role', '/complete-profile'];
  if (publicAuthPages.includes(location.pathname)) {
    return children;
  }

  // If no role selected, redirect to role selection
  if (!user?.role) {
    return <Navigate to="/select-role" replace />;
  }

  // If PATIENT role but profile incomplete, redirect to profile completion
  if (user.role === 'PATIENT' && !user.isProfileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  // Role-based route protection
  const currentPath = location.pathname;

  // Check if patient is trying to access hospital admin routes
  if (user.role === 'PATIENT') {
    const isHospitalRoute = HOSPITAL_ADMIN_ROUTES.some(route => 
      currentPath.startsWith(route)
    );
    if (isHospitalRoute) {
      return <Navigate to="/hospital-access" replace />;
    }
  }

  // Check if hospital admin is trying to access patient-only routes
  if (user.role === 'HOSPITAL_ADMIN') {
    const isPatientRoute = PATIENT_ONLY_ROUTES.some(route => 
      currentPath.startsWith(route)
    );
    if (isPatientRoute) {
      return <Navigate to="/hospital-dashboard" replace />;
    }
    
    // Redirect hospital admin from home to dashboard
    if (currentPath === '/') {
      return <Navigate to="/hospital-dashboard" replace />;
    }
  }

  // Render protected content if all checks pass
  return children;
};

export default ProtectedRoute;
