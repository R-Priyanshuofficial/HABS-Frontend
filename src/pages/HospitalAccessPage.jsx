/**
 * HospitalAccessPage - Shown to patients trying to access hospital dashboard
 * Full-screen design with hospital registration CTA
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ArrowLeft, 
  Shield, 
  Users, 
  Clock, 
  TrendingUp,
  ArrowRight,
  Heart,
  CheckCircle,
  Stethoscope,
  Calendar,
  BarChart3
} from 'lucide-react';

const HospitalAccessPage = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Users,
      title: 'Manage Appointments',
      description: 'Handle patient bookings effortlessly with smart scheduling'
    },
    {
      icon: Clock,
      title: 'Queue Management',
      description: 'Real-time queue tracking reduces wait times'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track performance with detailed insights'
    },
    {
      icon: Shield,
      title: 'Verified Badge',
      description: 'Build trust with verified hospital status'
    },
    {
      icon: Calendar,
      title: 'Smart Calendar',
      description: 'Organized view of all appointments'
    },
    {
      icon: Stethoscope,
      title: 'Doctor Profiles',
      description: 'Showcase your specialist team'
    }
  ];

  const stats = [
    { number: '500+', label: 'Happy Patients' },
    { number: '30+', label: 'Partner Hospitals' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Full Width */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

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
              <Building2 className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Hospital Dashboard
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              This section is exclusively for registered healthcare providers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Access Restricted Notice - Full Width */}
      <section className="bg-blue-50 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4 text-center md:text-left"
          >
            <div className="flex items-center space-x-2 text-blue-700">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Access Restricted</span>
            </div>
            <p className="text-blue-600">
              You're logged in as a <strong>Patient</strong>. The Hospital Dashboard is only available to registered healthcare facilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Are you a Hospital Section - Full Width */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Are you a Hospital or Clinic?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join HABS and connect with thousands of patients looking for quality healthcare
            </p>
          </motion.div>

          {/* Benefits Grid - Full Width */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
                >
                  <div className="bg-primary-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                alert('Hospital registration coming soon! Contact us at support@habs.com');
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-10 py-4 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl font-bold text-lg"
            >
              <Building2 className="w-6 h-6" />
              <span>Register Your Hospital</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 bg-white text-gray-700 px-10 py-4 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg border-2 border-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Full Width Background */}
      <section className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Already a Partner Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-gray-600 mb-4">
              Already a partner hospital?
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="text-primary-600 font-bold text-lg hover:underline inline-flex items-center space-x-2"
            >
              <span>Login with your hospital credentials</span>
              <ArrowRight className="w-5 h-5" />
            </button>
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

export default HospitalAccessPage;
