/**
 * PatientAccessDenied - Shown to hospital admins trying to access patient-only routes
 * Premium design matching the overall HABS aesthetic
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lock, 
  ArrowLeft, 
  Building2, 
  Shield, 
  Users,
  Heart,
  ArrowRight,
  AlertTriangle,
  Home
} from 'lucide-react';

const PatientAccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
        </div>

        {/* Floating Lock Icon */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute top-10 right-10 md:right-20"
        >
          <Lock className="w-32 h-32 md:w-48 md:h-48 text-white" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="bg-white/20 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-2xl"
            >
              <AlertTriangle className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Access Restricted
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              This page is exclusively for patients
            </p>
          </motion.div>
        </div>
      </section>

      {/* Access Notice */}
      <section className="bg-orange-50 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4 text-center md:text-left"
          >
            <div className="flex items-center space-x-2 text-orange-700">
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">Hospital Account Detected</span>
            </div>
            <p className="text-orange-600">
              You're logged in as a <strong>Hospital</strong>. This area is only available to registered patients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-6 text-white">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold">Hospital Admin Account</h2>
                  <p className="text-white/80 text-sm">You have access to the Hospital Dashboard features</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What you can access:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-green-50 px-4 py-3 rounded-xl">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Hospital Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-green-50 px-4 py-3 rounded-xl">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Appointment Management</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-green-50 px-4 py-3 rounded-xl">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Home Page</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's restricted:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-red-50 px-4 py-3 rounded-xl">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Find Hospitals (Patient Feature)</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-red-50 px-4 py-3 rounded-xl">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Book Appointments (Patient Feature)</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-red-50 px-4 py-3 rounded-xl">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-gray-700 font-medium">My Bookings (Patient Feature)</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/hospital-dashboard')}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg font-bold"
                >
                  <Building2 className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/')}
                  className="flex-1 flex items-center justify-center space-x-2 bg-white text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-100 transition-all font-semibold border-2 border-gray-200"
                >
                  <Home className="w-5 h-5" />
                  <span>Go to Home</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Heart className="w-4 h-4 text-primary-500" />
            <span>HABS - Healthcare Made Accessible</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientAccessDenied;
