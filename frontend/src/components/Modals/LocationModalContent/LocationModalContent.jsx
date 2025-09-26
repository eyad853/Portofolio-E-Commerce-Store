import React, { useState } from 'react';
import { MapPin, X, Search } from 'lucide-react';

const LocationModalContent = ({ onClose, onLocationSelect }) => {
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
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd reverse geocode these coordinates
          const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocation(mockAddress);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
          alert('Unable to get your current location. Please enter manually.');
        }
      );
    } else {
      setIsLoadingLocation(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handlePopularLocationClick = (popularLocation) => {
    setLocation(popularLocation);
  };

  return (
    <div className="bg-white rounded-2xl w-full max-w-lg mx-auto overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Select Your Location
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
        <p className="text-gray-600 text-sm mb-4 sm:mb-6">
          Enter your address to see delivery options and estimated delivery times
        </p>

        {/* Current Location Button */}
        <button
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          className="w-full flex items-center justify-center p-3 sm:p-4 mb-4 sm:mb-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] touch-manipulation"
        >
          <MapPin size={18} className="mr-2 flex-shrink-0" />
          <span className="text-sm sm:text-base font-medium">
            {isLoadingLocation ? 'Getting location...' : 'Use Current Location'}
          </span>
        </button>

        {/* Search Input */}
        <div className="relative mb-4 sm:mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your full address"
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
            autoFocus
          />
        </div>

        {/* Popular locations */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
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
                className="w-full text-left p-3 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors text-sm text-gray-600 touch-manipulation"
              >
                <MapPin size={14} className="inline mr-2 text-gray-400" />
                {popularLocation}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onClose}
          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium touch-manipulation min-h-[48px]"
        >
          Cancel
        </button>
        <button
          onClick={handleLocationSubmit}
          disabled={!location.trim()}
          className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium touch-manipulation min-h-[48px]"
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};

export default LocationModalContent;