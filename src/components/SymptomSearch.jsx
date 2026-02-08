import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { specialtyAPI } from '../services/api';

const commonSymptoms = [
  'Fever', 'Headache', 'Cough', 'Cold', 'Stomach Pain',
  'Chest Pain', 'Joint Pain', 'Tooth Pain', 'Skin Rash',
  'Back Pain', 'Breathing Problem', 'Ear Pain'
];

const SymptomSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const { setSelectedSymptom, setSelectedSpecialty } = useApp();

  const handleSearch = async (symptom) => {
    setSearchTerm(symptom);
    setSelectedSymptom(symptom);

    try {
      const response = await specialtyAPI.searchBySymptom(symptom);
      if (response.data.success && response.data.data.length > 0) {
        setSelectedSpecialty(response.data.data[0]);
      }
      if (onSearch) {
        onSearch(symptom);
      }
    } catch (error) {
      console.error('Error searching symptoms:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 1) {
      const filtered = commonSymptoms.filter(symptom =>
        symptom.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Main Search Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 ${
          isFocused ? 'border-primary-500 shadow-primary-100' : 'border-gray-100'
        }`}
      >
        {/* Search Input Row */}
        <div className="flex items-center p-2">
          <div className="flex items-center flex-1 pl-4">
            <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-primary-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              placeholder="Search by symptom (e.g., fever, headache, chest pain...)"
              className="flex-1 px-4 py-3 text-lg focus:outline-none bg-transparent text-gray-900 placeholder-gray-400"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSearch(searchTerm)}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            Search
          </motion.button>
        </div>

        {/* Search Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute w-full top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto"
          >
            {suggestions.map((symptom, index) => (
              <button
                key={index}
                onClick={() => {
                  handleSearch(symptom);
                  setSuggestions([]);
                }}
                className="w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors flex items-center space-x-2 border-b border-gray-100 last:border-b-0"
              >
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="font-medium">{symptom}</span>
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Quick Symptom Tags - Properly Centered */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-5 flex flex-wrap items-center justify-center gap-3"
      >
        <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>Popular:</span>
        </div>
        {commonSymptoms.slice(0, 6).map((symptom, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSearch(symptom)}
            className="px-4 py-2 bg-white border border-gray-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md"
          >
            {symptom}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default SymptomSearch;
