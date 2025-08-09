import React, { useState } from 'react';
import Modal from "react-modal";
import { RiVisaLine } from "react-icons/ri";

const BuyModal = ({ isOpen, setIsOpen }) => {
  const [cardnumber, setcardnumber] = useState("");
  const [cardholder, setcardholder] = useState("");
  const [month, setmonth] = useState("");
  const [year, setyear] = useState("");
  const [CVC, setCVC] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Check if all fields are filled
  const isFormFilled = cardnumber && cardholder && month && year && CVC;

  // Handle Form Submission
  const handleSubmit = () => {
    if (isFormFilled) {
      setSubmitted(true);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Payment"
      className="bg-white rounded-lg shadow-lg flex flex-col justify-center items-center pb-5 px-10"
      overlayClassName="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.35)]"
      shouldCloseOnOverlayClick={true}
    >
      {/* Show this if form is NOT submitted */}
      {!submitted ? (
        <div className="w-180 h-100 flex flex-col p-6">
          {/* Card Section */}
          <div className="w-full h-32 flex justify-center items-center">
            <div className="w-24 h-14 border border-gray-400 flex justify-center items-center text-5xl">
              <RiVisaLine className="text-blue-600" />
            </div>
          </div>

          {/* Input Fields */}
          <div className="flex-1 w-full">
            <div className="w-full h-10 flex justify-around items-center">
              <div className="h-full">
                <label className="text-gray-500">Card Number</label>
                <input value={cardnumber} onChange={(e) => setcardnumber(e.target.value)} className="outline-none border border-gray-500 ml-3 h-full p-1" type="text" />
              </div>
              <div className="h-full">
                <label className="text-gray-500">Cardholder</label>
                <input value={cardholder} onChange={(e) => setcardholder(e.target.value)} className="outline-none border border-gray-500 ml-3 h-full p-1" type="text" />
              </div>
            </div>

            <div className="w-full h-10 flex justify-around items-center mt-5">
              <div className="h-full flex items-center">
                <label>Expires in</label>
                <input value={month} onChange={(e) => setmonth(e.target.value)} placeholder="month" type="number" className="w-32 outline-none h-full border-gray-500 border ml-2" />
                <input value={year} onChange={(e) => setyear(e.target.value)} placeholder="year" type="text" className="w-32 outline-none h-full border-gray-500 border ml-2" />
              </div>
              <div className="h-full flex items-center">
                <label>CVC</label>
                <input value={CVC} onChange={(e) => setCVC(e.target.value)} type="text" className="h-full ml-5 outline-none border border-gray-500" />
              </div>
            </div>

            <div className="mx-72 mt-3 gap-2.5 flex w-full">
              <input type="checkbox" />
              <div>Save my details</div>
            </div>

            {/* Confirm Payment Button */}
            <button 
              onClick={handleSubmit} 
              disabled={!isFormFilled} 
              className={`w-full h-14 mt-4 transition-all duration-200 flex justify-center items-center ${
                isFormFilled ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Payment
            </button>
          </div>
        </div>
      ) : (
        /* Show this content after submission */
        <div className="w-180 h-100 flex justify-center flex-col p-6 text-center">
          <h2 className="text-xl font-bold">Payment Successful!</h2>
          <p className="mt-4 text-gray-600">Your transaction has been processed successfully.</p>
          <button 
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            onClick={() => {
              setSubmitted(false);
              setIsOpen(false);
            }}
          >
            Close
          </button>
        </div>
      )}
    </Modal>
  );
};

export default BuyModal;