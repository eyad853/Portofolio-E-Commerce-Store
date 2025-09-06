import React, { useEffect, useState } from 'react'
import Nav from '../../components/Nav/Nav'
import axios from 'axios'
import { TbPointFilled } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import { Link } from 'react-router-dom';

const UserOrders = ({user, darkMode,storeName,storeLogo}) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = async() => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/getUserOrders`, {
        withCredentials: true
      })
      if(response && response.data) {
        setOrders(response.data.orders || [])
        console.log(response.data.orders);
      }
    } catch(error) {
      console.log(error);
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const cancelOrder = async(orderId) => {
    try {
      // Optimistically update UI
      const originalOrders = [...orders]
      setOrders(orders.filter(order => order._id !== orderId))
      
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/order/cancel/${orderId}`, {
        withCredentials: true
      })
      
      if(!response.data.success) {
        // Revert if API call failed
        setOrders(originalOrders)
        alert('Failed to cancel order')
      }
    } catch(err) {
      console.log(err);
      // Revert on error
      setOrders(orders.filter(order => order._id !== orderId))
      alert('Failed to cancel order')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className={`w-screen h-screen overflow-auto ${darkMode ? "bg-[#1A1A1A] text-[#EAEAEA]" : "bg-neutral-50"}`}>
      <Nav storeName={storeName} storeLogo={storeLogo} darkMode={darkMode} user={user}/>

      {loading?(
        <div className='w-full h-full inset-0 flex justify-center items-center'>
            <div className="w-60 h-60 md:w-80 md:h-80 rounded-full border-y-2 border-blue-600 animate-spin"></div>
          </div>
      ):(<div className="w-full h-full pt-16 md:pt-20 px-2 sm:px-4 md:px-8">
        <div className={`w-full min-h-full border px-3 sm:px-4 md:px-6 pt-4 flex flex-col shadow-2xl rounded-xl ${darkMode ? "bg-[#2A2A2A] border-[#3A3A3A]" : "bg-white border-neutral-300"}`}>
          <div className={`text-lg sm:text-xl font-bold ${darkMode ? "text-[#EAEAEA]" : ""}`}>Orders History</div>
          <div className={`mt-2 font-semibold text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{orders.length} orders</div>

          <div className="flex-1 pb-6">
            {orders?.length > 0 ? (
              <div className="w-full">
                {orders.map(order => (
                  <div key={order._id} className={`border flex flex-col shadow-lg rounded-lg mt-5 px-3 sm:px-4 md:px-5 py-4 w-full min-h-[250px] sm:min-h-[300px] ${darkMode ? "border-[#3A3A3A] bg-[#2A2A2A]" : "border-neutral-300 bg-white"}`}>
                    
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                      <div className="flex items-center">
                        <TbPointFilled className={`${darkMode ? "text-gray-400" : ""} text-sm sm:text-base`}/>
                        <span className={`mb-0.5 font-semibold ml-1 text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-neutral-600"}`}>
                          Delivered In Few Days
                        </span>
                      </div>
                      <div className={`text-xs sm:text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Order #{order._id?.slice(-8)}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <div>Order Date: {formatDate(order.createdAt)}</div>
                      <div className={`font-semibold text-base sm:text-lg ${darkMode ? "text-[#EAEAEA]" : "text-black"}`}>
                        Total: ${order.totalPrice || '0.00'}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex">
                      {/* Cancel Button */}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="w-[8%] sm:w-[5%] md:w-[3%] text-xl sm:text-2xl flex items-start justify-center pt-2">
                          <div 
                            className="p-1 flex justify-center items-center h-full rounded-full text-red-500"
                            title="Cancel Order"
                          >
                            <div 
                            onClick={() => {
                                cancelOrder(order._id)
                            }}
                            className="p-0.5 hover:bg-red-100 cursor-pointer transition-all duration-300 rounded-full">
                              <IoMdClose/>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Products List */}
                      <div className="flex-1">
                        {order.orderItems && order.orderItems.length > 0 ? (
                          <div className="w-full">
                            {order.orderItems.map((item, index) => (
                              <div key={index} className={`w-full relative border-b last:border-b-0 py-3 flex flex-col sm:flex-row sm:items-center gap-3 ${darkMode ? "border-[#3A3A3A]" : "border-neutral-200"}`}>
                                <Link to={`/product/${item?.product?._id}`} className='absolute inset-0'></Link>
                                
                                {/* Product Image */}
                                <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-lg flex justify-center items-center flex-shrink-0 ${darkMode ? "bg-[#3A3A3A]" : "bg-gray-100"}`}>
                                  <img 
                                    src={`${import.meta.env.VITE_BACKEND_URL}${item.product?.mainImage}`} 
                                    className='w-full h-full object-cover rounded-lg' 
                                    alt={item.product?.name || 'Product'} 
                                    onError={(e) => {
                                      e.target.src = '/placeholder-image.png'
                                    }}
                                  />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1">
                                  <h3 className={`font-semibold mb-1 text-sm sm:text-base ${darkMode ? "text-[#EAEAEA]" : "text-gray-800"}`}>
                                    {item.product?.name || 'Product Name'}
                                  </h3>
                                  <div className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    <div>Quantity: {item.quantity}</div>
                                    <div>Price: ${item.price?.toFixed(2) || '0.00'}</div>
                                  </div>
                                </div>

                                {/* Item Total */}
                                <div className="text-left sm:text-right">
                                  <div className={`font-semibold text-sm sm:text-base ${darkMode ? "text-[#EAEAEA]" : "text-gray-800"}`}>
                                    ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                  </div>
                                </div>

                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={`text-center py-8 text-sm sm:text-base ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                            No items found in this order
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className={`mt-4 pt-3 border-t ${darkMode ? "border-[#3A3A3A]" : "border-neutral-200"}`}>
                        <div className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          <strong>Shipping Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode} {order.shippingAddress.country}
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center flex-col min-h-[400px]">
                <div className={`text-base sm:text-lg font-semibold text-center px-4 ${darkMode ? "text-gray-400" : "text-neutral-600"}`}>You haven't placed any orders yet</div>
                <Link to={'/home'} className="font-bold text-xl sm:text-2xl mt-5 text-blue-500 hover:text-blue-600 transition-colors text-center">
                  Start shopping now!
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>)}
    </div>
  )
}

export default UserOrders