import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaUser, FaPlus, FaMinus, FaShoppingBag } from "react-icons/fa";
import Nav from '../../components/Nav/Nav';
import PaymentModal from '../../components/Modals/PaymentModal/PaymentModal';

const Cart = ({ isCartOpen, setIsCartOpen, user, darkMode,storeName,storeLogo}) => {
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [isOpen , setIsOpen]=useState(false)
  const [clientSecret, setClientSecret] = useState('');

  const [shippingAddress , setShippingAddress]=useState({})


  const handleCheckout = async () => {
    const amount = calculateTotalInCents(); // get total in cents
  try {
    const response = await axios.post('http://localhost:8000/create-payment-intent', {
      amount
    });

    if (response) {
      setClientSecret(response.data.clientSecret); // store it in state
      setIsOpen(true); // open modal after getting clientSecret
    }
  } catch (error) {
    console.error('Error creating payment intent:', error);
  }
};

  const getUserLocation = async () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=0995dd79459147c780516bcc0d0da58d`
        );

        const components = res.data.results[0].components;

        const shippingAddress = {
          address: components.road || "",
          city: components.city || components.town || components.village || "",
          postalCode: components.postcode || "",
          country: components.country || ""
        };

        setShippingAddress(shippingAddress)

      } catch (error) {
        console.error(error);
        alert("Failed to get location or send data.");
      }
    },
    (error) => {
      console.error(error);
      alert("Location access denied or failed.");
    }
  );
};

const clearCart = async () => {
  try {
    setCart([])
    const response = await axios.delete(`http://localhost:8000/cart/clear`,{ 
        withCredentials: true 
      });
    console.log(response.data.message); // "Cart cleared successfully"
    // You can also update UI or state here after clearing
  } catch (error) {
    console.error('Failed to clear cart:', error.response?.data?.message || error.message);
  }
};

  // Get cart products
  const getCartProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/cart/getAll", { 
        withCredentials: true 
      });
      
      if (response) {
        setCart(response.data);
      } else {
        setError('Failed to load cart');
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        setError('Please log in to view your cart');
      } else {
        setError('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    try {
      setCart(prevCart => ({...prevCart,items: prevCart.items.filter(item => item.productId && item.productId._id !== productId)}));
      const response = await axios.delete(`http://localhost:8000/cart/remove/${productId}`, {
        withCredentials: true
      });
    } catch (err) {
      console.log(err);
      setError('Failed to remove item');
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0).toFixed(2);
  };

  const calculateTotalInCents = () => {
  if (!cart.items) return 0;
  const total = cart.items.reduce((sum, item) => {
    return sum + (item.productId?.price || 0) * item.quantity;
  }, 0);
  return Math.round(total * 100); // returns 1999
};

  // Calculate total items
  const getTotalItems = () => {
    if (!cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    getCartProducts();
  }, []);

  const increaseQuantity = async(productId)=>{
    try{
      setCart((prevCart) => ({...prevCart,items: prevCart.items.map((item) =>item.productId._id === productId? { ...item, quantity: item.quantity + 1 }: item),}));
      const response = axios.put(`http://localhost:8000/cart/increase/${productId}`, {}  , {
        withCredentials: true
      })
    }catch(err){
      console.log(err);
    }
  }

  const decreaseQuantity = async(productId)=>{
    try{
      setCart((prevCart) => ({...prevCart,items: prevCart.items.map((item) =>item.productId._id === productId? { ...item, quantity: item.quantity - 1 }: item),}));
      const response = axios.put(`http://localhost:8000/cart/decrease/${productId}`, {} , {
        withCredentials: true
      })
    }catch(err){
      console.log(err);
    }
  }

  if (loading) {
    return (
      <div className={`w-full min-h-screen flex flex-col overflow-x-hidden ${darkMode ? "bg-[#1A1A1A] text-[#EAEAEA]" : "bg-gray-50"}`}>
        <Nav user={user} />
        <div className="w-full h-screen flex justify-center items-center pt-16">
          <div className={`${darkMode ? "text-[#EAEAEA]" : "text-xl font-semibold"}`}>Loading your cart...</div>
        </div>
      </div>
    );
  }

  console.log(cart);

  const createOrder = async () => {

  const orderItems = cart.items.map(item => ({
    product: item.productId?._id , // product id
    name: item.productId?.name,
    quantity: item.quantity,
    price: item.productId?.price,
  }));

  const order = {
    orderItems,
    shippingAddress,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice:parseFloat(calculateTotal()),
  };

  try {
    const response = await axios.post('http://localhost:8000/order/create', order, {
      withCredentials: true,
    });
    const secondResponse = await axios.patch('http://localhost:8000/order/upadteUserLocation',{location:shippingAddress} , {withCredentials:true})
    console.log("Order created:", response.data);
  } catch (error) {
    console.error("Order creation error:", error);
  }
};

  return (
    <>
    <div className={`w-full min-h-screen flex flex-col overflow-x-hidden ${darkMode ? "bg-[#1A1A1A] text-[#EAEAEA]" : "bg-gray-50"}`}>
      {/* Navbar */}
      <Nav darkMode={darkMode} user={user} storeName={storeName} storeLogo={storeLogo}/>

      {/* Error Message */}
      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-16">
          {error}
        </div>
      )}

      {/* Cart Content */}
      <div className="w-screen min-h-screen flex overflow-auto pt-20 px-4 md:px-10 pb-10">
        {cart?.items?.length > 0 ? (
          <div className="w-full flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className={`${darkMode ? "bg-[#2A2A2A] text-[#EAEAEA]" : "bg-white"} rounded-lg shadow-sm p-6`}>
                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? "text-[#EAEAEA]" : "text-gray-800"}`}>
                  <FaShoppingBag className="text-blue-600" />
                  Shopping Cart ({getTotalItems()} items)
                </h2>
                
                <div className="space-y-4">
                  {cart.items.map((item, index) => (
                    <div key={item.productId?._id || index} 
                        className={`flex relative cursor-pointer flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg hover:shadow-md transition-shadow ${darkMode ? "border-[#3A3A3A] bg-[#2A2A2A]" : "border border-gray-200 bg-white"}`}>
                          <Link className='inset-0 absolute' to={`/product/${item.productId?._id}`}></Link>
                      
                      {/* Product Image */}
                      <div className={`w-full md:w-24 h-48 md:h-24 rounded-lg overflow-hidden flex-shrink-0 ${darkMode ? "bg-[#3A3A3A]" : "bg-gray-200"}`}>
                        {item.productId?.mainImage ? (
                          <img 
                            src={`http://localhost:8000${item.productId.mainImage}`} 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 w-full">
                        <h3 className={`font-semibold text-lg ${darkMode ? "text-[#EAEAEA]" : "text-gray-800"}`}>
                          {item.productId?.name || 'Unknown Product'}
                        </h3>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mt-1`}>
                          {item.productId?.description || 'No description available'}
                        </p>
                        <p className="text-xl font-bold text-blue-600 mt-2">
                          ${item.productId?.price || 0}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decreaseQuantity(item.productId._id)}
                          disabled={updating || item.quantity <= 1}
                          className={`w-8 z-10 h-8 flex items-center justify-center rounded-full disabled:opacity-50 ${darkMode ? "bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#EAEAEA]" : "bg-gray-200 hover:bg-gray-300"}`}
                        >
                          <FaMinus className=" text-xs" />
                        </button>
                        
                        <span className={`w-12 text-center font-semibold ${darkMode ? "text-[#EAEAEA]" : ""}`}>
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => increaseQuantity(item.productId._id)}
                          disabled={updating}
                          className={`w-8 h-8 z-10 flex items-center justify-center rounded-full disabled:opacity-50 ${darkMode ? "bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#EAEAEA]" : "bg-gray-200 hover:bg-gray-300"}`}
                        >
                          <FaPlus className=" text-xs" />
                        </button>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`font-bold text-lg ${darkMode ? "text-[#EAEAEA]" : ""}`}>
                            ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.productId._id)}
                          disabled={updating}
                          className="p-2 z-10 cursor-pointer text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                          title="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className={`${darkMode ? "bg-[#2A2A2A] text-[#EAEAEA]" : "bg-white"} rounded-lg shadow-sm p-6 sticky top-24`}>
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-[#EAEAEA]" : ""}`}>Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <hr className={`my-3 ${darkMode ? "border-[#3A3A3A]" : ""}`} />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>

                <button 
                onClick={()=>{
                  getUserLocation()
                  handleCheckout()
                }}
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Proceed to Checkout
                </button>

                <Link 
                  to="/home" 
                  className="block w-full text-center mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Empty Cart
          <div className="w-screen h-scw-screen flex flex-col gap-6 justify-center items-center">
            <div className={`${darkMode ? "text-gray-700" : "text-gray-300"} `}>
              <FaShoppingBag size={120} />
            </div>
            <div className="text-center">
              <h2 className={`text-3xl font-bold mb-2 ${darkMode ? "text-[#EAEAEA]" : "text-gray-700"}`}>Your cart is empty</h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} mb-2`}>Looks like you haven't added anything yet.</p>
              <p className={`${darkMode ? "text-gray-500" : "text-gray-400"} text-lg mb-6`}>Start shopping and fill it with amazing products!</p>
              
              <Link 
                to="/home" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
      <PaymentModal darkMode={darkMode} createOrder={createOrder} clearCart={clearCart} user={user} isOpen={isOpen} setIsOpen={setIsOpen} clientSecret={clientSecret}/>
    </div>
    </>
  );
};

export default Cart;