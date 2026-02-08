/**
 * SelectRole Page - For users without assigned role
 * Allows users to select their role after login
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Building2, User, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { updateRole } from '../services/authService';

const SelectRole = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      type: 'PATIENT',
      icon: User,
      title: 'I am a Patient',
      description: 'Book appointments and manage your healthcare visits',
      color: 'bg-primary-500',
    },
    {
      type: 'HOSPITAL_ADMIN',
      icon: Building2,
      title: 'I am a Hospital Admin',
      description: 'Manage hospital slots, appointments and staff',
      color: 'bg-secondary-500',
    },
  ];

  const handleRoleSelection = async (roleType) => {
    if (!user?.email) {
      toast.error('User email not found. Please login again.');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const response = await updateRole(user.email, roleType);
      
      // Update auth context with new token and user data
      login(response.token, response.user);
      
      toast.success('Role selected successfully!');
      
      // Redirect based on role and profile completion
      if (roleType === 'PATIENT') {
        // Check if profile is complete
        if (response.user.isProfileComplete) {
          navigate('/');
        } else {
          navigate('/complete-profile');
        }
      } else if (roleType === 'HOSPITAL_ADMIN') {
        navigate('/hospital-dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-primary-500 w-16 h-16 rounded-2xl mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome to HABS
          </h1>
          <p className="text-gray-600 text-lg">
            Select your role to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.button
                key={role.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleRoleSelection(role.type)}
                disabled={loading}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className={`${role.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 card-lift`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {role.title}
                </h2>
                <p className="text-gray-600">
                  {role.description}
                </p>
                {loading && (
                  <div className="mt-4 flex items-center text-primary-600">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span className="text-sm">Updating...</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          You can change your role later in settings
        </p>
      </motion.div>
    </div>
  );
};

export default SelectRole;
