import React, { createContext, useContext, useState, useEffect } from 'react';
import { specialtyAPI } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchSpecialties();
    getUserLocation();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const response = await specialtyAPI.getAll();
      if (response.data.success) {
        setSpecialties(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied:', error);
          // Default to Rajkot coordinates
          setUserLocation({ lat: 22.3039, lng: 70.8022 });
        }
      );
    } else {
      // Default to Rajkot coordinates
      setUserLocation({ lat: 22.3039, lng: 70.8022 });
    }
  };

  const value = {
    specialties,
    loading,
    setLoading,
    selectedSymptom,
    setSelectedSymptom,
    selectedSpecialty,
    setSelectedSpecialty,
    userLocation,
    setUserLocation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
