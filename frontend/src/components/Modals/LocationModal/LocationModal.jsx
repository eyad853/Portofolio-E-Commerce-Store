import Modal from 'react-modal';
import LocationModalContent from '../LocationModalContent/LocationModalContent';
import React from 'react'

const LocationModal = ({isModalOpen,setIsModalOpen,darkMode,setShippingAddress,handleCheckout}) => {
    
    const handleLocationSelect = (selectedLocation) => {
        setShippingAddress(selectedLocation)
        handleCheckout()
    };

  return (
   <Modal
    isOpen={isModalOpen}
    onRequestClose={() => setIsModalOpen(false)}
    className={`w-140 h-auto p-6 rounded-xl shadow-xl absolute top-1/2 left-1/2 transform  -translate-x-1/2 -translate-y-1/2 outline-none`}
    overlayClassName="fixed inset-0 bg-gray-500/50 z-50 flex justify-center items-center"
>
  <LocationModalContent
    onClose={() => setIsModalOpen(false)}
    onLocationSelect={handleLocationSelect}
    darkMode={darkMode}
  />
</Modal>
  )
}

export default LocationModal