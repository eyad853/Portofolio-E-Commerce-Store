import React, { useState, useEffect } from 'react';
import { Sun, Moon, Store, Upload, DollarSign, Settings, ToggleRight, ToggleLeft } from 'lucide-react';
import axios from 'axios';

// Main Settings Component
const SettingsPage = ({
  storeName,
  storeLogo,
  maintenanceMode,
  currencySymbol,
  darkMode,
  setStoreName,
  setStoreLogo,
  setDarkMode,
  setMaintenanceMode,
  setCurrencySymbol,
  loadingSettings,
  setLoadingSettings,
  fetchSettings,
  error,
  setDashboardError
}) => {
  const [storeLogoPreview, setStoreLogoPreview] = useState(
    storeLogo || 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=Logo'
  )
  const [showMessage, setShowMessage] = useState(false)

  // Define theme colors
  const bgPrimary = darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50';
  const bgSecondary = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';
  const bgTertiary = darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-neutral-300' : 'text-gray-600';
  const textTertiary = darkMode ? 'text-neutral-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-neutral-600' : 'border-gray-200';
  const borderColorLight = darkMode ? 'border-neutral-700' : 'border-gray-300';
  const inputBg = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';
  const cardBg = darkMode ? 'bg-[#2A2A2A]/50' : 'bg-gray-50';
  const innerCardBg = darkMode ? 'bg-[#1E1E1E]' : 'bg-white';

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update logo preview when storeLogo prop changes
  useEffect(() => {
    if (storeLogo && typeof storeLogo === 'string') {
      setStoreLogoPreview(storeLogo);
    } else if (storeLogo && storeLogo instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreLogoPreview(reader.result);
      };
      reader.readAsDataURL(storeLogo);
    } else {
      setStoreLogoPreview('https://placehold.co/100x100/A0AEC0/FFFFFF?text=Logo');
    }
  }, [storeLogo]);

  /**
   * Save settings to backend
   */
  const saveSettings = async () => {
    if (loadingSettings) return; // Prevent multiple concurrent saves
    
    setLoadingSettings(true);

    const formData = new FormData()
    formData.append('storeName', storeName)
    formData.append('logo', storeLogo)
    formData.append('darkMode', darkMode)
    formData.append('maintenanceMode', maintenanceMode)
    formData.append('currencySymbol', currencySymbol)

    try {
      const { data } = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/settings/update`, formData);
      console.log(data);
      
      fetchSettings()
      
      showSuccessMessage('Settings saved successfully!');
    } catch (err) {
      setDashboardError(error?.response?.data?.message);
      console.error('Settings save error:', err);
    } finally {
      setLoadingSettings(false);
    }
  };

  /**
   * Handles the file selection for the store logo.
   */
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        return;
      }
      
      setStoreLogo(file);
    }
  };

  /**
   * Shows a success message
   */
  const showSuccessMessage = (message) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-gray-500/50 bg-opacity-50 flex items-center justify-center z-50 p-4';
    messageBox.innerHTML = `
      <div class="${bgSecondary} p-4 sm:p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto border ${borderColor}">
        <div class="mb-4">
          <div class="w-12 h-12 ${darkMode ? 'bg-green-900' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold ${textPrimary} mb-2">Success!</h3>
          <p class="text-sm ${textSecondary}">${message}</p>
        </div>
        <button id="closeMessageBox" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Close
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);

    // Add event listener to close the message box
    document.getElementById('closeMessageBox').onclick = () => {
      document.body.removeChild(messageBox);
    };

    // Auto-close after 3 seconds
    setTimeout(() => {
      if (document.body.contains(messageBox)) {
        document.body.removeChild(messageBox);
      }
    }, 3000);
  };

  const handleClick = () => {
    setShowMessage(true)
    setTimeout(() => {
      setShowMessage(false)
    }, 2000)
  }

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} p-3 sm:p-4 md:p-6 lg:p-8 transition-all duration-300`}>
      <div className={`max-w-4xl mx-auto ${bgSecondary} rounded-xl shadow-xl border ${borderColor} p-4 sm:p-6 md:p-8`}>
        
        {/* Page Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700 gap-4">
          <div className="flex items-center">
            <div className={`p-2 sm:p-3 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} rounded-lg mr-3 sm:mr-4 flex-shrink-0`}>
              <Settings className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={window.innerWidth < 640 ? 24 : 32} />
            </div>
            <div className="min-w-0">
              <h1 className={`text-2xl sm:text-3xl font-bold ${textPrimary} truncate`}>Store Settings</h1>
              <p className={`text-xs sm:text-sm ${textSecondary} mt-1`}>Configure your store preferences and appearance</p>
            </div>
          </div>
          
          <button
            onClick={saveSettings}
            disabled={loadingSettings}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm sm:text-base whitespace-nowrap ${
              loadingSettings 
                ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
          >
            {loadingSettings ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 ${darkMode ? 'bg-red-900/50 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-800'} border rounded-lg`}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Grid layout for settings sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* General Settings Section */}
          <div className={`${cardBg} p-4 sm:p-6 rounded-xl border ${borderColorLight}`}>
            <div className="flex items-center mb-4 sm:mb-6">
              <Store className={`mr-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} size={24} />
              <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>General Settings</h2>
            </div>

            {/* Store Name Input Field */}
            <div className="mb-4 sm:mb-6">
              <label htmlFor="storeName" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Store Name
              </label>
              <input
                type="text"
                id="storeName"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${borderColorLight} rounded-lg ${inputBg} ${textPrimary} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm sm:text-base`}
                value={storeName || ''}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g., My Online Shop"
              />
            </div>

            {/* Store Logo Upload Section */}
            <div className="mb-4 sm:mb-6">
              <label htmlFor="storeLogo" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Store Logo
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed ${darkMode ? 'border-gray-500' : 'border-gray-300'} flex-shrink-0`}>
                  {storeLogoPreview && storeLogoPreview !== 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=Logo' ? (
                    <img 
                      src={storeLogoPreview} 
                      alt="Store Logo Preview" 
                      className="w-full h-full object-contain" 
                      onError={(e) => e.target.src = 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=Error'} 
                    />
                  ) : (
                    <Upload className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={window.innerWidth < 640 ? 24 : 32} />
                  )}
                </div>
                <div className="flex-1 w-full sm:w-auto">
                  <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 inline-flex items-center text-sm sm:text-base">
                    <Upload className="mr-2" size={16} />
                    <input
                      type="file"
                      id="storeLogo"
                      className="hidden"
                      name='logo'
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    Upload Logo
                  </label>
                  {storeLogo && storeLogo instanceof File && (
                    <p className={`text-sm ${textSecondary} mt-2 truncate`}>{storeLogo.name}</p>
                  )}
                  <p className={`text-xs ${textTertiary} mt-1`}>
                    PNG or JPG, max 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Currency Symbol Input Field */}
            <div>
              <label htmlFor="currencySymbol" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Currency Symbol
              </label>
              <div className="relative">
                <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                <input
                  type="text"
                  id="currencySymbol"
                  className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border ${borderColorLight} rounded-lg ${inputBg} ${textPrimary} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm sm:text-base`}
                  value={currencySymbol || ''}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  placeholder="e.g., $, €, £"
                  maxLength="5"
                />
              </div>
            </div>
          </div>

          {/* Display Settings & Maintenance Section */}
          <div className={`${cardBg} p-4 sm:p-6 rounded-xl border ${borderColorLight}`}>
            <div className="flex items-center mb-4 sm:mb-6">
              <Settings className={`mr-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={24} />
              <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Display & System</h2>
            </div>

            {/* Dark Mode Toggle Switch */}
            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 ${innerCardBg} rounded-lg border ${borderColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0 mr-3">
                  <div className={`p-2 rounded-lg mr-3 flex-shrink-0 ${darkMode ? 'bg-blue-900' : darkMode ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                    {darkMode ? (
                      <Moon className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
                    ) : (
                      <Sun className="text-yellow-600" size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="darkModeToggle" className={`text-sm sm:text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} cursor-pointer block truncate`}>
                      {darkMode ? 'Dark Mode' : 'Light Mode'}
                    </label>
                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                      {darkMode ? 'Switch to light appearance' : 'Switch to dark appearance'}
                    </p>
                  </div>
                </div>
                <button
                  id="darkModeToggle"
                  onClick={() => setDarkMode(prev => !prev)}
                  className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex-shrink-0 ${
                    darkMode ? 'bg-blue-600 focus:ring-blue-500' : 'bg-gray-300 focus:ring-gray-400'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                      darkMode ? 'translate-x-6 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Maintenance Mode Toggle Switch */}
            <div className={`p-3 sm:p-4 ${innerCardBg} rounded-lg border ${borderColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0 mr-3">
                  <div className={`p-2 rounded-lg mr-3 flex-shrink-0 ${maintenanceMode ? (darkMode ? 'bg-red-900' : 'bg-red-100') : (darkMode ? 'bg-gray-800' : 'bg-gray-100')}`}>
                    {maintenanceMode ? (
                      <ToggleRight className={`${darkMode ? 'text-red-400' : 'text-red-600'}`} size={20} />
                    ) : (
                      <ToggleLeft className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="maintenanceModeToggle" className={`text-sm sm:text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} cursor-pointer block truncate`}>
                      Maintenance Mode
                    </label>
                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                      {maintenanceMode ? 'Store is in maintenance mode' : 'Store is live and accessible'}
                    </p>
                  </div>
                </div>
                <button
                  id="maintenanceModeToggle"
                  onClick={() => {
                    handleClick()
                    setMaintenanceMode(!maintenanceMode)
                  }}
                  className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex-shrink-0 ${
                    maintenanceMode ? 'bg-red-600 focus:ring-red-500' : 'bg-gray-300 focus:ring-gray-400'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                      maintenanceMode ? 'translate-x-6 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className={`mt-6 sm:mt-8 pt-4 sm:pt-6 border-t ${borderColor}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className={`text-xs sm:text-sm ${textSecondary} mb-4 sm:mb-0`}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Feature Not Available Message */}
      {showMessage && (
        <div className="fixed top-4 right-4 sm:top-20 sm:right-20 w-72 sm:w-80 h-16 sm:h-20 flex justify-center items-center rounded-md text-white bg-red-500 shadow-lg z-50 px-4">
          <span className="text-sm sm:text-base text-center">This Feature is not available right now</span>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;