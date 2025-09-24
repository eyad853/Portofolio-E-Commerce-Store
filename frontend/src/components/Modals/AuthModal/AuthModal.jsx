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
        shouldCloseOnOverlayClick={!isProcessing}
        shouldCloseOnEsc={!isProcessing}
        className="bg-white p-6 rounded-lg shadow-lg  w-11/12 max-w-md  mx-auto  mt-20  sm:mt-32
        "
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-startsm:items-center">
        <h2 className="text-lg sm:text-xl font-bold mb-3">Do you want to sign up?</h2>
        <p className="mb-4 text-sm sm:text-base">
           You must sign up to add this product to your cart and complete the purchase.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleSignUp}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Sign Up
          </button>
        </div>
      </Modal>
  )
}

export default AuthModal