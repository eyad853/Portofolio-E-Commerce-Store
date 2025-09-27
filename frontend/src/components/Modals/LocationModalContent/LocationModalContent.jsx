import React, { useState } from 'react';
import { MapPin, X, Search } from 'lucide-react';

const LocationModalContent = ({ onClose, onLocationSelect, darkMode, className  }) => {
  const [location, setLocation] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleLocationSubmit = () => {
    if (location.trim()) {
      onLocationSelect(location);
      onClose();
    }
  };

  const getCurrentLocation = () => {
  setIsLoadingLocation(true);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // 🔑 Replace with your real API key
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${import.meta.env.VITE_G_KEY}`
          );
          const data = await res.json();
          console.log("Reverse geocoding result:", data);

          const formattedAddress =
            data.results[0]?.formatted || `${latitude}, ${longitude}`;

          setLocation(formattedAddress);
          handleLocationSubmit(formattedAddress)
        } catch (err) {
          console.error("Error reverse geocoding:", err);
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoadingLocation(false);
        alert("Unable to get your current location. Please enter manually.");
      }
    );
  } else {
    setIsLoadingLocation(false);
    alert("Geolocation is not supported by this browser.");
  }
};

  const handlePopularLocationClick = (popularLocation) => {
    setLocation(popularLocation);
    handleLocationSubmit(popularLocation)
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-lg mx-auto overflow-hidden  shadow-2xl ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Select Your Location
        </h2>
        <button
          onClick={onClose}
          className={`p-2 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} rounded-full transition-colors touch-manipulation`}
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto hide-scrollbar">
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 sm:mb-6`}>
          Enter your address to see delivery options and estimated delivery times
        </p>

        {/* Current Location Button */}
        <button
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          className={`w-full flex items-center justify-center p-3 sm:p-4 mb-4 sm:mb-6 border-2 ${
            darkMode 
              ? 'border-blue-500 text-blue-400 hover:bg-blue-900/20 active:bg-blue-900/30' 
              : 'border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100'
          } rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] touch-manipulation`}
        >
          <MapPin size={18} className="mr-2 flex-shrink-0" />
          <span className="text-sm sm:text-base font-medium">
            {isLoadingLocation ? 'Getting location...' : 'Use Current Location'}
          </span>
        </button>

        {/* Search Input */}
        <div className="relative mb-4 sm:mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <Search size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your full address"
            className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            autoFocus
          />
        </div>

        {/* Popular locations */}
        <div className="mb-4 sm:mb-6">
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
            Popular Locations
          </h3>
          <div className="space-y-2">
            {[
              'New York, NY 10001',
              'Los Angeles, CA 90210',
              'Chicago, IL 60601',
              'Houston, TX 77001'
            ].map((popularLocation) => (
              <button
                key={popularLocation}
                onClick={() => handlePopularLocationClick(popularLocation)}
                className={`w-full text-left p-3 rounded-lg transition-colors text-sm touch-manipulation ${
                  darkMode 
                    ? 'hover:bg-gray-700 active:bg-gray-600 text-gray-300' 
                    : 'hover:bg-gray-50 active:bg-gray-100 text-gray-600'
                }`}
              >
                <MapPin size={14} className={`inline mr-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                {popularLocation}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t ${
        darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <button
          onClick={onClose}
          className={`flex-1 py-3 px-4 border rounded-lg transition-colors font-medium touch-manipulation min-h-[48px] ${
            darkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700 active:bg-gray-600' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleLocationSubmit}
          disabled={!location.trim()}
          className={`flex-1 py-3 px-4 rounded-lg transition-colors font-medium touch-manipulation min-h-[48px] ${
            darkMode 
              ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-600' 
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300'
          } disabled:cursor-not-allowed text-white`}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};

// Demo App with proper Modal wrapper component
const ModalWrapper = ({ isOpen, onClose, children, darkMode, overlayClassName = '' }) => {
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 ${overlayClassName}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
};

export default LocationModalContent