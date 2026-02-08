import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Clock, 
  MapPin, 
  Smartphone,
  Shield,
  Zap,
  ArrowRight,
  Star,
  Calendar,
  Heart,
  Stethoscope,
  AlertCircle,
  ChevronRight,
  Quote,
  Phone,
  Mail,
  Activity,
  Users,
  Award,
  TrendingUp,
  Sparkles,
  HeartPulse,
  Pill,
  Salad,
  Moon,
  Dumbbell
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import SymptomSearch from '../components/SymptomSearch';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Format today's date
  const formatDate = () => {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Quick actions for patients
  const quickActions = [
    {
      icon: Calendar,
      title: 'Book Appointment',
      description: 'Find a doctor and book now',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      path: '/hospitals'
    },
    {
      icon: Clock,
      title: 'My Appointments',
      description: 'View upcoming visits',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      path: '/my-bookings'
    },
    {
      icon: Building2,
      title: 'Find Hospitals',
      description: 'Explore nearby facilities',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      path: '/hospitals'
    },
    {
      icon: AlertCircle,
      title: 'Emergency',
      description: 'Get immediate help',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      path: '/hospitals?emergency=true'
    }
  ];

  // Featured hospitals (sample data)
  const featuredHospitals = [
    {
      name: 'Apollo Hospital',
      rating: 4.8,
      specialty: 'Multi-Specialty',
      distance: '2.5 km',
      image: '🏥'
    },
    {
      name: 'Fortis Healthcare',
      rating: 4.7,
      specialty: 'Cardiology',
      distance: '3.8 km',
      image: '🏨'
    },
    {
      name: 'Max Super Specialty',
      rating: 4.9,
      specialty: 'Neurology',
      distance: '5.2 km',
      image: '🏥'
    }
  ];

  // Health tips
  const healthTips = [
    {
      icon: HeartPulse,
      title: 'Stay Active',
      description: '30 minutes of daily exercise reduces heart disease risk by 35%',
      color: 'text-red-500'
    },
    {
      icon: Salad,
      title: 'Eat Healthy',
      description: 'Include 5 servings of fruits and vegetables daily for optimal health',
      color: 'text-green-500'
    },
    {
      icon: Moon,
      title: 'Sleep Well',
      description: '7-8 hours of quality sleep boosts immunity and mental clarity',
      color: 'text-indigo-500'
    },
    {
      icon: Dumbbell,
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily for better metabolism',
      color: 'text-blue-500'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      text: 'HABS made booking my appointment so easy! No more waiting in long queues.',
      avatar: '👩'
    },
    {
      name: 'Rahul Verma',
      location: 'Delhi',
      rating: 5,
      text: 'The real-time queue tracking is amazing. I saved 2 hours on my last visit!',
      avatar: '👨'
    },
    {
      name: 'Anita Patel',
      location: 'Bangalore',
      rating: 5,
      text: 'Finding the right specialist has never been easier. Highly recommended!',
      avatar: '👩‍⚕️'
    }
  ];

  // Stats with animation
  const stats = [
    { number: 500, suffix: '+', label: 'Happy Patients', icon: Users },
    { number: 30, suffix: '+', label: 'Partner Hospitals', icon: Building2 },
    { number: 50, suffix: '+', label: 'Specialists', icon: Stethoscope },
    { number: 4.8, suffix: '', label: 'Avg Rating', icon: Star, isDecimal: true }
  ];

  // Features
  const features = [
    {
      icon: MapPin,
      title: 'Location-Based Search',
      description: 'Find the nearest hospitals and clinics based on your current location'
    },
    {
      icon: Clock,
      title: 'Real-Time Queue Updates',
      description: 'See live wait times and available slots for smarter scheduling'
    },
    {
      icon: Smartphone,
      title: 'Instant Confirmation',
      description: 'Get SMS and WhatsApp notifications for all your bookings'
    },
    {
      icon: Shield,
      title: 'Verified Hospitals',
      description: 'All listed hospitals are verified with updated information'
    }
  ];

  // Auto-rotate health tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [healthTips.length]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleSearch = () => {
    navigate('/hospitals');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Hero Section with Personalized Welcome */}
      <section className="relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl" />
          <div className="absolute top-20 -left-20 w-60 h-60 bg-primary-100 rounded-full opacity-40 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
          {/* Personalized Welcome */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-2 text-gray-500 text-sm mb-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate()}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {getGreeting()}, <span className="text-primary-600">{user?.name || 'there'}!</span>
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              How can we help you with your healthcare today?
            </p>
          </motion.div>

          {/* Symptom Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10"
          >
            <SymptomSearch onSearch={handleSearch} />
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(action.path)}
                  className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100 group"
                >
                  <div className={`${action.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                  <div className="flex items-center mt-3 text-primary-600 text-sm font-medium">
                    <span>Go</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Health Tip Banner */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTipIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center space-x-4"
            >
              <div className="bg-white/20 p-3 rounded-xl">
                {React.createElement(healthTips[currentTipIndex].icon, {
                  className: 'w-6 h-6 text-white'
                })}
              </div>
              <div className="text-white">
                <h4 className="font-bold">{healthTips[currentTipIndex].title}</h4>
                <p className="text-white/90 text-sm">{healthTips[currentTipIndex].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {healthTips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTipIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentTipIndex ? 'bg-white w-6' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hospitals */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Hospitals</h2>
              <p className="text-gray-600 mt-1">Top-rated healthcare facilities near you</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/hospitals')}
              className="flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredHospitals.map((hospital, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate('/hospitals')}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{hospital.image}</div>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm font-bold text-yellow-700">{hospital.rating}</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{hospital.name}</h3>
                <p className="text-primary-600 font-medium text-sm mb-2">{hospital.specialty}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{hospital.distance} away</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-white/80 text-lg">
              Join the growing community of satisfied patients
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  className="text-center"
                >
                  <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.isDecimal ? stat.number : stat.number}{stat.suffix}
                  </div>
                  <p className="text-white/80 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose HABS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Why Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Healthcare Made Simple
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We solve the two biggest healthcare pain points - finding the right facility and reducing wait times
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="bg-primary-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real patients
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonialIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 md:p-12 shadow-xl border border-primary-100 text-center"
              >
                <Quote className="w-12 h-12 text-primary-300 mx-auto mb-6" />
                <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                  "{testimonials[currentTestimonialIndex].text}"
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-4xl">{testimonials[currentTestimonialIndex].avatar}</div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900">{testimonials[currentTestimonialIndex].name}</h4>
                    <p className="text-gray-500">{testimonials[currentTestimonialIndex].location}</p>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  {[...Array(testimonials[currentTestimonialIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonialIndex 
                      ? 'bg-primary-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Skip the Queue?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Book your appointment now and save hours of waiting time
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/hospitals')}
              className="bg-white text-primary-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-lg font-bold text-lg inline-flex items-center space-x-2"
            >
              <span>Find Hospitals Near You</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary-500 p-2 rounded-xl">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <span className="text-2xl font-bold">HABS</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Healthcare Appointment Booking System - Making healthcare accessible, 
                one appointment at a time.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/hospitals'); }} className="text-gray-400 hover:text-white transition-colors">
                    Find Hospitals
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/my-bookings'); }} className="text-gray-400 hover:text-white transition-colors">
                    My Appointments
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} HABS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
