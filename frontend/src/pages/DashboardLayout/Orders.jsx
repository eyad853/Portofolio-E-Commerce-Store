import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FiPackage, FiX, FiSearch, FiFilter, FiEye } from 'react-icons/fi'

const Orders = ({ darkMode }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrders, setSelectedOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredOrder, setHoveredOrder] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const ordersPerPage = 8

  // Define theme colors
  const bgPrimary = darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50';
  const bgSecondary = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';
  const bgTertiary = darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-neutral-300' : 'text-gray-600';
  const textTertiary = darkMode ? 'text-neutral-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-neutral-600' : 'border-gray-300';
  const hoverBg = darkMode ? 'hover:bg-[#1E1E1E]' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';
  const tooltipBg = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';
  const tooltipBorder = darkMode ? 'border-neutral-600' : 'border-gray-200';

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8000/order/getAll', {
        withCredentials: true
      })
      
      if (response.data && !response.data.error) {
        setOrders(response.data.orders || [])
      } else {
        setError('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Calculate summary statistics
  const totalOrders = orders.length
  const canceledOrders = orders.filter(order => !order.isDelivered && order.deliveredAt === null).length
  const deliveredOrders = orders.filter(order => order.isDelivered).length
  const pendingOrders = totalOrders - deliveredOrders - canceledOrders

  // Handle checkbox selection
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(order => order._id))
    }
  }

  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'delivered' && order.isDelivered) ||
      (filterStatus === 'pending' && !order.isDelivered && !order.deliveredAt) ||
      (filterStatus === 'canceled' && !order.isDelivered && order.deliveredAt === null)

    return matchesSearch && matchesFilter
  })

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    })
  }

  // Format address
  const formatAddress = (address) => {
    if (!address) return 'N/A'
    return `${address.city || ''}, ${address.country || ''}`.replace(/^,\s*|,\s*$/g, '') || 'N/A'
  }

  // Get order status
  const getOrderStatus = (order) => {
    if (order.isDelivered) {
      return { 
        text: 'Delivered', 
        color: darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800' 
      }
    }
    if (!order.isDelivered && order.deliveredAt === null) {
      return { 
        text: 'Canceled', 
        color: darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800' 
      }
    }
    return { 
      text: 'Pending', 
      color: darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800' 
    }
  }

  // Handle tooltip positioning and mouse events
  const handleMouseEnter = (event, order) => {
    const rect = event.target.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    setTooltipPosition({
      x: rect.left + window.pageXOffset,
      y: rect.top + scrollTop
    })
    setHoveredOrder(order)
  }

  const handleMouseLeave = (event) => {
    const relatedTarget = event.relatedTarget
    if (relatedTarget && relatedTarget.closest('.order-tooltip')) {
      return
    }
    setHoveredOrder(null)
  }

  // Tooltip component for order items
  const OrderItemsTooltip = ({ order, isVisible, position }) => {
    if (!isVisible || !order.orderItems || order.orderItems.length === 0) return null

    return (
      <div 
        className={`order-tooltip fixed z-50 w-72 ${tooltipBg} border ${tooltipBorder} rounded-lg shadow-lg p-4`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translateY(-100%)'
        }}
        onMouseEnter={() => setHoveredOrder(order)}
        onMouseLeave={() => setHoveredOrder(null)}
      >
        <div className={`text-sm font-semibold ${textPrimary} mb-3`}>
          Order Items ({order.orderItems.length})
        </div>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {order.orderItems.map((item, index) => (
            <div key={index} className={`flex items-center space-x-3 py-2 border-b ${darkMode ? 'border-neutral-700' : 'border-gray-100'} last:border-b-0`}>
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name || 'Product'} 
                  className="w-8 h-8 object-cover rounded"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${textPrimary} truncate`}>
                  {item.name || item.product?.name || 'Unknown Product'}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${textTertiary}`}>
                    Qty: {item.qty || item.quantity || 1}
                  </span>
                  <span className={`text-xs font-semibold ${textPrimary}`}>
                    ${((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={`mt-3 pt-2 border-t ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <span className={`text-sm font-semibold ${textPrimary}`}>Total:</span>
            <span className={`text-sm font-bold ${textPrimary}`}>
              ${order.totalPrice?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`p-6 h-full flex items-center justify-center ${bgPrimary}`}>
        <div className="w-60 h-60 sm:w-80 sm:h-80 rounded-full border-y-2 border-blue-600 animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-6 h-full flex items-center justify-center ${bgPrimary}`}>
        <div className={`text-lg font-semibold text-red-500 ${textPrimary}`}>{error}</div>
      </div>
    )
  }

  return (
    <div className={`p-3 sm:p-6 h-full overflow-auto ${bgPrimary}`}>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className={`text-xl sm:text-2xl font-bold ${textPrimary} mb-1`}>Orders Management</h1>
        <p className={`${textSecondary} text-sm`}>Manage and track all customer orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className={`${bgSecondary} rounded-lg shadow p-3 sm:p-4`}>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100">
              <FiPackage className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className={`text-xs font-medium ${textSecondary}`}>Total Orders</p>
              <p className={`text-lg sm:text-xl font-bold ${textPrimary}`}>{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className={`${bgSecondary} rounded-lg shadow p-3 sm:p-4`}>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100">
              <FiX className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className={`text-xs font-medium ${textSecondary}`}>Canceled</p>
              <p className={`text-lg sm:text-xl font-bold ${textPrimary}`}>{canceledOrders}</p>
            </div>
          </div>
        </div>

        <div className={`${bgSecondary} rounded-lg shadow p-3 sm:p-4`}>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100">
              <FiPackage className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className={`text-xs font-medium ${textSecondary}`}>Delivered</p>
              <p className={`text-lg sm:text-xl font-bold ${textPrimary}`}>{deliveredOrders}</p>
            </div>
          </div>
        </div>

        <div className={`${bgSecondary} rounded-lg shadow p-3 sm:p-4`}>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100">
              <FiPackage className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className={`text-xs font-medium ${textSecondary}`}>Pending</p>
              <p className={`text-lg sm:text-xl font-bold ${textPrimary}`}>{pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`${bgSecondary} rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6`}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textTertiary} h-4 w-4`} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-9 pr-4 py-2 border ${borderColor} ${inputBg} ${textPrimary} rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-48`}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-3 py-2 border ${borderColor} ${inputBg} ${textPrimary} rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-auto`}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <div className={`text-sm font-semibold ${textSecondary}`}>
            {filteredOrders.length} orders
          </div>
        </div>
      </div>

      {/* Orders Grid - Desktop */}
      <div className={`${bgSecondary} rounded-lg shadow overflow-hidden hidden lg:block`}>
        {/* Header */}
        <div className={`${bgTertiary} px-4 py-3 border-b ${borderColor}`}>
          <div className="grid grid-cols-12 gap-2 items-center text-xs font-medium text-gray-500 uppercase">
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2">Order #</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-1">Total</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Items</div>
          </div>
        </div>

        {/* Rows */}
        <div className={`divide-y ${darkMode ? 'divide-neutral-700' : 'divide-gray-200'}`}>
          {currentOrders.map((order) => (
            <div key={order._id} className={`px-4 py-3 ${hoverBg} transition-colors duration-200`}>
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => handleSelectOrder(order._id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="col-span-2">
                  <div className={`text-sm font-medium ${textPrimary}`}>
                    #{order._id.slice(-6)}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className={`text-sm font-medium ${textPrimary} truncate`}>
                    {order.user?.username || 'Unknown'}
                  </div>
                  <div className={`text-xs ${textTertiary} truncate`}>
                    {order.user?.email || ''}
                  </div>
                </div>
                
                <div className="col-span-1">
                  <div className={`text-sm font-semibold ${textPrimary}`}>
                    ${order.totalPrice?.toFixed(2) || '0.00'}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className={`text-sm ${textTertiary}`}>
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatus(order).color}`}>
                    {getOrderStatus(order).text}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <div 
                    className="font-semibold cursor-pointer text-blue-600 hover:text-blue-800 transition-colors text-sm"
                    onMouseEnter={(e) => handleMouseEnter(e, order)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {order.orderItems.length} items
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`${bgTertiary} px-4 py-3 border-t ${borderColor}`}>
            <div className="flex items-center justify-between">
              <div className={`text-sm ${textSecondary}`}>
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm border ${borderColor} rounded disabled:opacity-50 disabled:cursor-not-allowed ${hoverBg} ${textPrimary}`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm border ${borderColor} rounded disabled:opacity-50 disabled:cursor-not-allowed ${hoverBg} ${textPrimary}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {currentOrders.map((order) => (
          <div key={order._id} className={`${bgSecondary} rounded-lg shadow p-4`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order._id)}
                  onChange={() => handleSelectOrder(order._id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div>
                  <div className={`text-sm font-medium ${textPrimary}`}>
                    Order #{order._id.slice(-6)}
                  </div>
                  <div className={`text-xs ${textTertiary}`}>
                    {formatDate(order.createdAt)}
                  </div>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatus(order).color}`}>
                {getOrderStatus(order).text}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className={`text-xs ${textTertiary} mb-1`}>Customer</div>
                <div className={`text-sm font-medium ${textPrimary} truncate`}>
                  {order.user?.username || 'Unknown'}
                </div>
                <div className={`text-xs ${textTertiary} truncate`}>
                  {order.user?.email || ''}
                </div>
              </div>
              <div>
                <div className={`text-xs ${textTertiary} mb-1`}>Total</div>
                <div className={`text-lg font-bold ${textPrimary}`}>
                  ${order.totalPrice?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div 
                className="font-semibold cursor-pointer text-blue-600 hover:text-blue-800 transition-colors text-sm"
                onMouseEnter={(e) => handleMouseEnter(e, order)}
                onMouseLeave={handleMouseLeave}
              >
                {order.orderItems.length} items
              </div>
              <div className={`text-xs ${textTertiary}`}>
                Ship to: {formatAddress(order.shippingAddress)}
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className={`${bgSecondary} rounded-lg shadow p-4`}>
            <div className="flex items-center justify-between">
              <div className={`text-sm ${textSecondary}`}>
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm border ${borderColor} rounded disabled:opacity-50 disabled:cursor-not-allowed ${hoverBg} ${textPrimary}`}
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm border ${borderColor} rounded disabled:opacity-50 disabled:cursor-not-allowed ${hoverBg} ${textPrimary}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip - render outside the overflow container */}
      {hoveredOrder && (
        <OrderItemsTooltip 
          order={hoveredOrder} 
          isVisible={true}
          position={tooltipPosition}
        />
      )}

      {/* Selected Orders Actions */}
      {selectedOrders.length > 0 && (
        <div className={`fixed bottom-4 right-4 ${bgSecondary} rounded-lg shadow-lg p-3 border ${borderColor} z-10`}>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${textSecondary}`}>
              {selectedOrders.length} selected
            </span>
            <button className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-200">
              Export
            </button>
            <button 
              onClick={() => setSelectedOrders([])}
              className={`px-3 py-1 ${darkMode ? 'bg-neutral-600 hover:bg-neutral-700' : 'bg-gray-300 hover:bg-gray-400'} ${textPrimary} text-sm font-medium rounded transition-colors duration-200`}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className={`${bgSecondary} rounded-lg shadow p-8 text-center`}>
          <FiPackage className={`mx-auto h-8 w-8 ${textTertiary} mb-3`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No orders found</h3>
          <p className={`${textSecondary} text-sm`}>
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No orders have been placed yet.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default Orders