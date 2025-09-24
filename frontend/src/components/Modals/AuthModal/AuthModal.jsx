import React from 'react'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom';

const AuthModal = ({showModal , setShowModal, pendingProduct}) => {
    const navigate = useNavigate();

  const handleSignUp = () => {
    if (pendingProduct) {
      localStorage.setItem("pendingProduct", pendingProduct); // ✅ save product before signup
    }
    setShowModal(false);
    navigate("/signup"); // go to signup page
  };

  return (
    <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Signup Choice"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="bg-white/95 backdrop-blur-lg border border-gray-200/50 p-8 rounded-2xl shadow-2xl w-11/12 max-w-md mx-auto mt-20 sm:mt-32 relative overflow-hidden"
        overlayClassName="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-sm flex justify-center items-start sm:items-center z-50">
        
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 rounded-2xl"></div>
        
        {/* Close button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Join Us Today!
          </h2>
          
          <p className="mb-6 text-center text-gray-600 leading-relaxed">
            Create an account to add this product to your cart and unlock exclusive features.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSignUp}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Create Account
            </button>
            
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              Maybe Later
            </button>
          </div>

          {/* Benefits list */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-3">Why sign up?</p>
            <div className="space-y-2">
              {[
                'Save products to your cart',
                'Track your order history',
                'Get exclusive deals'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
  )
}

export default AuthModal