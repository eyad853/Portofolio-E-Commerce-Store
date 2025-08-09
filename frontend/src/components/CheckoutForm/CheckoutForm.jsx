import { useStripe, useElements, CardElement, CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';

function CheckoutForm({ clientSecret,setIsOpen,clearCart ,createOrder, darkMode}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardNumber = elements.getElement(CardNumberElement);
    const cardExpiry = elements.getElement(CardExpiryElement);
    const cardCvc = elements.getElement(CardCvcElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumber,
        billing_details: {
          name: 'John Doe',
        },
      },
    });

    if (result.error) {
      // Show error to customer
      console.error(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        // Payment succeeded
        setIsOpen(false)
        createOrder()
        
        clearCart()
        console.log('Payment succeeded!');
      }
    }
  };

  const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "14px",
      color: darkMode ? "#ffffff" : "#32325d",
      backgroundColor: darkMode ? "#2A2A2A" : "transparent",
      fontFamily: "Arial, sans-serif",
      "::placeholder": {
        color: darkMode ? "#aab7c4" : "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
    },
  },
};
       
  return (
     <form className="flex flex-col gap-3 sm:gap-4 w-full" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-1 sm:gap-2">
        <span className={`text-sm sm:text-base ${darkMode ? "text-white" : "text-black"}`}>Card Number</span>
        <div className={`border ${darkMode ? "border-[#2A2A2A] bg-[#2A2A2A]" : "border-gray-300"} p-2 sm:p-3 rounded`}>
          <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </label>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-10">
        <label className="flex w-full flex-col gap-1 sm:gap-2">
            <span className={`text-sm sm:text-base ${darkMode ? "text-white" : "text-black"}`}>Expiration Date</span>
            <div className={`border ${darkMode ? "border-[#2A2A2A] bg-[#2A2A2A]" : "border-gray-300"} p-2 sm:p-3 rounded w-full sm:w-1/2`}>
            <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
            </div>
        </label>

        <label className="flex w-full flex-col gap-1 sm:gap-2">
            <span className={`text-sm sm:text-base ${darkMode ? "text-white" : "text-black"}`}>CVC</span>
            <div className={`border ${darkMode ? "border-[#2A2A2A] bg-[#2A2A2A]" : "border-gray-300"} p-2 sm:p-3 rounded w-full sm:w-1/3`}>
            <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
            </div>
        </label>
      </div>
      
       <button
       type="submit"
       className={`${darkMode ? "bg-blue-600" : "bg-blue-600"} transform hover:scale-105 transition-all duration-300 mt-3 sm:mt-5 cursor-pointer text-white p-2 sm:p-3 rounded text-sm sm:text-base`}>
        Pay
      </button>
    </form>
  );
}

export default CheckoutForm