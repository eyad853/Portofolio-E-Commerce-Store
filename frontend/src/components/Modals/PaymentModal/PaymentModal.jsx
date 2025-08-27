import { Elements } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import CheckoutForm from '../../CheckoutForm/CheckoutForm'
import { stripePromise } from '../../../stripe'
import axios from 'axios'

const PaymentModal = ({isOpen,setIsOpen ,clearCart , clientSecret , createOrder, darkMode}) => {
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setIsOpen(false)
      }}
      className={`w-[95vw] sm:w-[90vw] md:w-160 h-auto max-h-[90vh] ${darkMode ? "bg-[#1A1A1A] text-white" : "bg-white"} p-4 sm:p-6 rounded-xl shadow-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 outline-none mx-2 sm:mx-0 overflow-y-auto`}
      overlayClassName="fixed inset-0 bg-gray-500/50 z-50 flex justify-center items-center px-2 sm:px-0"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      >
        <Elements stripe={stripePromise}>
          <CheckoutForm createOrder={createOrder} clearCart={clearCart} clientSecret={clientSecret} setIsOpen={setIsOpen} darkMode={darkMode}/>
        </Elements>
    </Modal>
  )
}

export default PaymentModal