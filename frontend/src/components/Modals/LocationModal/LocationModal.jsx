import Modal from 'react-modal';
import LocationModalContent from '../LocationModalContent/LocationModalContent';
import React from 'react'

const LocationModal = () => {

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  content: {
    position: 'relative',
    top: 'auto',
    left: 'auto', 
    right: 'auto',
    bottom: 'auto',
    border: 'none',
    background: 'transparent',
    padding: '0',
    overflow: 'visible',
  },
};

  return (
    <Modal
    isOpen={isModalOpen}
    onRequestClose={() => setIsModalOpen(false)}
    style={customStyles}
    contentLabel="Location Modal"
    shouldCloseOnOverlayClick={true}
    shouldCloseOnEsc={true}
>
  <LocationModalContent
    onClose={() => setIsModalOpen(false)}
    onLocationSelect={handleLocationSelect}
  />
</Modal>
  )
}

export default LocationModal