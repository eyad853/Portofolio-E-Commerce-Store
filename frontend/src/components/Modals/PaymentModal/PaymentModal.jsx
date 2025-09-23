import { Elements } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import CheckoutForm from '../../CheckoutForm/CheckoutForm'
import { stripePromise } from '../../../stripe'
import axios from 'axios'

// Test Card Information Component
const TestCardInfo = ({ darkMode, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className={`fixed top-4 right-4 w-80 p-4 rounded-lg shadow-lg z-[60] ${
      darkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-semibold text-sm">Test Card Numbers</h3>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="font-medium">Visa (Success)</div>
          <div className="font-mono">4242 4242 4242 4242</div>
        </div>
        
        <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="font-medium">Visa (Declined)</div>
          <div className="font-mono">4000 0000 0000 0002</div>
        </div>
        
        <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="font-medium">Mastercard</div>
          <div className="font-mono">5555 5555 5555 4444</div>
        </div>
        
        <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="font-medium">American Express</div>
          <div className="font-mono">3782 8224 6310 005</div>
        </div>
        
        <div className="text-xs opacity-75 mt-3 pt-2 border-t border-gray-300 dark:border-gray-600">
          <div>• Use any future expiry date</div>
          <div>• Use any 3-4 digit CVC</div>
          <div>• Use any ZIP code</div>
        </div>
      </div>
    </div>
  )
}

const PaymentModal = ({isOpen, setIsOpen, clearCart, clientSecret, createOrder, darkMode}) => {
  const [paymentStatus, setPaymentStatus] = useState(null) // 'success', 'error', null
  const [statusMessage, setStatusMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Auto-close after showing status message
  useEffect(() => {
    if (paymentStatus && (paymentStatus === 'success' || paymentStatus === 'error')) {
      const timer = setTimeout(() => {
        setIsOpen(false)
        setPaymentStatus(null)
        setStatusMessage('')
      }, 3000) // Close after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [paymentStatus, setIsOpen])

  const handlePaymentResult = (success, message) => {
    setIsProcessing(false)
    if (success) {
      setPaymentStatus('success')
      setStatusMessage(message || 'Payment successful! Your order has been confirmed.')
    } else {
      setPaymentStatus('error')
      setStatusMessage(message || 'Payment failed. Please try again.')
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      setIsOpen(false)
      setPaymentStatus(null)
      setStatusMessage('')
    }
  }

  return (
    <>
      
      {/* Test Card Information - Rendered outside modal with higher z-index */}
      {isOpen && <TestCardInfo darkMode={darkMode} isVisible={isOpen} />}
      
      <Modal
        isOpen={isOpen}
        onRequestClose={handleClose}
        className={`w-[95vw] sm:w-[90vw] md:w-160 h-auto max-h-[90vh] ${
          darkMode ? "bg-[#1A1A1A] text-white" : "bg-white"
        } p-4 sm:p-6 rounded-xl shadow-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 outline-none mx-2 sm:mx-0 overflow-y-auto`}
        overlayClassName="fixed inset-0 bg-gray-500/50 z-50 flex justify-center items-center px-2 sm:px-0"
        shouldCloseOnOverlayClick={!isProcessing}
        shouldCloseOnEsc={!isProcessing}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Complete Your Payment
          </h2>
          {!isProcessing && (
            <button
              onClick={handleClose}
              className={`p-2 rounded-full hover:bg-gray-200 ${darkMode ? "hover:bg-gray-700" : ""} transition-colors`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Payment Status Messages */}
        {paymentStatus && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            paymentStatus === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          } ${darkMode && paymentStatus === 'success' ? 'bg-green-900/20 border-green-700 text-green-300' : ''}
          ${darkMode && paymentStatus === 'error' ? 'bg-red-900/20 border-red-700 text-red-300' : ''}`}>
            
            {paymentStatus === 'success' ? (
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            
            <div>
              <p className="font-medium">
                {paymentStatus === 'success' ? 'Payment Successful!' : 'Payment Failed'}
              </p>
              <p className="text-sm mt-1">{statusMessage}</p>
              {paymentStatus === 'success' && (
                <p className="text-xs mt-2 opacity-75">This window will close automatically...</p>
              )}
            </div>
          </div>
        )}

        {/* Payment Form */}
        {!paymentStatus && (
          <>
            {/* Security Badge */}
            <div className={`mb-4 p-3 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"} flex items-center gap-2`}>
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">
                <span className="font-medium">Secure Payment</span> - Your payment information is encrypted and secure
              </span>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm 
                createOrder={createOrder} 
                clearCart={clearCart} 
                clientSecret={clientSecret} 
                setIsOpen={setIsOpen} 
                darkMode={darkMode}
                onPaymentResult={handlePaymentResult}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </Elements>
          </>
        )}
      </Modal>
    </>
  )
}

export default PaymentModal