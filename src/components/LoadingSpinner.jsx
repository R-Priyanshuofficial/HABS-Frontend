import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="bg-gradient-to-br from-primary-500 to-secondary-500 p-4 rounded-full mb-4"
      >
        <Heart className="w-8 h-8 text-white" />
      </motion.div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
