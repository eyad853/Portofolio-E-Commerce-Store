import { useStripe, useElements, CardElement, CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

function CheckoutForm({ 
  clientSecret, 
  setIsOpen, 
  clearCart, 
  createOrder, 
  darkMode, 
  onPaymentResult,
  isProcessing,
  setIsProcessing 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      onPaymentResult(false, 'Payment system not ready. Please try again.');
      return;
    }

    setIsProcessing(true);
    setErrors({});

    const cardNumber = elements.getElement(CardNumberElement);
    
    if (!cardNumber) {
      onPaymentResult(false, 'Payment form not properly loaded. Please refresh and try again.');
      return;
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: 'Customer', // You can make this dynamic later
          },
        },
      });

      if (result.error) {
        // Handle specific error types
        let errorMessage = result.error.message;
        
        switch (result.error.type) {
          case 'card_error':
            errorMessage = `Card Error: ${result.error.message}`;
            break;
          case 'validation_error':
            errorMessage = `Validation Error: ${result.error.message}`;
            break;
          case 'invalid_request_error':
            errorMessage = 'Invalid payment request. Please contact support.';
            break;
          default:
            errorMessage = result.error.message || 'An unexpected error occurred.';
        }
        
        onPaymentResult(false, errorMessage);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          try {
            // Create order first
            await createOrder();
            // Clear cart after successful order creation
            clearCart();
            
            onPaymentResult(true, 'Payment successful! Your order has been confirmed and you will receive a confirmation email shortly.');
          } catch (orderError) {
            console.error('Order creation failed:', orderError);
            onPaymentResult(true, 'Payment successful, but there was an issue creating your order. Please contact support with your payment confirmation.');
          }
        } else {
          onPaymentResult(false, `Payment ${result.paymentIntent.status}. Please try again or contact support.`);
        }
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      onPaymentResult(false, 'An unexpected error occurred during payment processing. Please try again.');
    }
  };

  const handleElementChange = (element, field) => {
    return (event) => {
      if (event.error) {
        setErrors(prev => ({ ...prev, [field]: event.error.message }));
      } else {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    };
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        color: darkMode ? "#ffffff" : "#424770",
        backgroundColor: darkMode ? "#2A2A2A" : "transparent",
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: darkMode ? "#87CEEB" : "#aab7c4",
        },
        ":-webkit-autofill": {
          color: darkMode ? "#ffffff" : "#424770",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <form className="flex flex-col gap-4 sm:gap-5 w-full" onSubmit={handleSubmit}>
      {/* Card Number */}
      <label className="flex flex-col gap-2">
        <span className={`text-sm sm:text-base font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
          Card Number
        </span>
        <div className={`border rounded-lg p-3 sm:p-4 transition-colors ${
          errors.cardNumber 
            ? 'border-red-500 bg-red-50' 
            : darkMode 
              ? "border-gray-600 bg-[#2A2A2A] hover:border-gray-500 focus-within:border-blue-500" 
              : "border-gray-300 bg-white hover:border-gray-400 focus-within:border-blue-500"
        }`}>
          <CardNumberElement 
            options={CARD_ELEMENT_OPTIONS} 
            onChange={handleElementChange('cardNumber', 'cardNumber')}
          />
        </div>
        {errors.cardNumber && (
          <span className="text-red-500 text-sm">{errors.cardNumber}</span>
        )}
      </label>

      {/* Expiry and CVC Row */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Expiration Date */}
        <label className="flex flex-1 flex-col gap-2">
          <span className={`text-sm sm:text-base font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
            Expiration Date
          </span>
          <div className={`border rounded-lg p-3 sm:p-4 transition-colors ${
            errors.cardExpiry 
              ? 'border-red-500 bg-red-50' 
              : darkMode 
                ? "border-gray-600 bg-[#2A2A2A] hover:border-gray-500 focus-within:border-blue-500" 
                : "border-gray-300 bg-white hover:border-gray-400 focus-within:border-blue-500"
          }`}>
            <CardExpiryElement 
              options={CARD_ELEMENT_OPTIONS} 
              onChange={handleElementChange('cardExpiry', 'cardExpiry')}
            />
          </div>
          {errors.cardExpiry && (
            <span className="text-red-500 text-sm">{errors.cardExpiry}</span>
          )}
        </label>

        {/* CVC */}
        <label className="flex flex-1 flex-col gap-2">
          <span className={`text-sm sm:text-base font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
            CVC
          </span>
          <div className={`border rounded-lg p-3 sm:p-4 transition-colors ${
            errors.cardCvc 
              ? 'border-red-500 bg-red-50' 
              : darkMode 
                ? "border-gray-600 bg-[#2A2A2A] hover:border-gray-500 focus-within:border-blue-500" 
                : "border-gray-300 bg-white hover:border-gray-400 focus-within:border-blue-500"
          }`}>
            <CardCvcElement 
              options={CARD_ELEMENT_OPTIONS} 
              onChange={handleElementChange('cardCvc', 'cardCvc')}
            />
          </div>
          {errors.cardCvc && (
            <span className="text-red-500 text-sm">{errors.cardCvc}</span>
          )}
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`
          relative mt-4 sm:mt-6 py-3 sm:py-4 px-6 rounded-lg font-semibold text-white
          transition-all duration-200 transform
          ${isProcessing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02] active:scale-[0.98]'
          }
          disabled:hover:scale-100 disabled:hover:from-gray-400 disabled:hover:to-gray-400
          shadow-lg hover:shadow-xl
          text-base sm:text-lg
        `}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Complete Payment
          </div>
        )}
      </button>

      {/* Footer Note */}
      <div className={`text-center text-xs sm:text-sm mt-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        <p>🔒 Your payment information is secure and encrypted</p>
      </div>
    </form>
  );
}

export default CheckoutForm;