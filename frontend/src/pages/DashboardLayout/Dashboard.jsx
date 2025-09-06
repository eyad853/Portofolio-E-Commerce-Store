import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShoppingBag, Users, Package, DollarSign, TrendingUp, Eye, Calendar, Filter } from 'lucide-react';
import axios from 'axios';

const Dashboard = ({ overview, ordersPerDay, monthlyOverview, topSellingProducts, darkMode }) => {
  const [hoveredOrder, setHoveredOrder] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/getAll`, {
        withCredentials: true
      });
      
      if (response.data && !response.data.error) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Calculate summary statistics
  const totalOrders = orders.length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  };

  // Format address
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.city || ''}, ${address.country || ''}`.replace(/^,\s*|,\s*$/g, '') || 'N/A';
  };

  // Get order status
  const getOrderStatus = (order) => {
    if (order.isDelivered) return { 
      text: 'Delivered', 
      color: darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800' 
    };
    if (!order.isDelivered && order.deliveredAt === null) return { 
      text: 'Canceled', 
      color: darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800' 
    };
    return { 
      text: 'Pending', 
      color: darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800' 
    };
  };

  const handleMouseEnter = (event, order) => {
    const rect = event.target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    setTooltipPosition({
      x: rect.left + window.pageXOffset,
      y: rect.top + scrollTop
    });
    setHoveredOrder(order);
  };

  const handleMouseLeave = (event) => {
    const relatedTarget = event.relatedTarget;
    if (relatedTarget && relatedTarget.closest('.order-tooltip')) {
      return;
    }
    setHoveredOrder(null);
  };

  // Process orders per day data for chart
  const processOrdersPerDayData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      name: new Date(item._id).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      orders: item.count
    }));
  };

  // Process monthly overview data for revenue chart
  const processMonthlyRevenueData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      name: `${item._id.month}/${item._id.year}`,
      revenue: item.totalRevenue
    }));
  };

  // Process top selling products for pie chart
  const processTopSellingData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];
    
    return data.map((item, index) => ({
      name: item.name,
      value: item.totalSold,
      color: colors[index % colors.length]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800';
      case 'Processing': return darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800';
      default: return darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  // Get processed data
  const ordersChartData = processOrdersPerDayData(ordersPerDay);
  const revenueChartData = processMonthlyRevenueData(monthlyOverview);
  const topSellingChartData = processTopSellingData(topSellingProducts);

  // Define colors based on dark mode
  const cardBg = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-neutral-400' : 'text-gray-600';
  const textTertiary = darkMode ? 'text-neutral-500' : 'text-gray-500';
  const borderColor = darkMode ? 'border-neutral-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-[#1E1E1E]' : 'hover:bg-gray-50';
  const tableBg = darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50';
  const dividerColor = darkMode ? 'divide-neutral-700' : 'divide-gray-200';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'} p-3 sm:p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-2`}>Dashboard Overview</h1>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} p-4 sm:p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm font-medium`}>Total Orders</p>
                <p className={`text-xl sm:text-2xl font-bold ${textPrimary} mt-1`}>{overview?.totalOrders || 0}</p>
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} p-4 sm:p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm font-medium`}>New Customers</p>
                <p className={`text-xl sm:text-2xl font-bold ${textPrimary} mt-1`}>{overview?.newCustomers || 0}</p>
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% from last month
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} p-4 sm:p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm font-medium`}>Total Products</p>
                <p className={`text-xl sm:text-2xl font-bold ${textPrimary} mt-1`}>{overview?.totalOrders || 0}</p>
                <p className="text-blue-600 text-sm mt-1 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Active products
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} p-4 sm:p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm font-medium`}>Total Revenue</p>
                <p className={`text-xl sm:text-2xl font-bold ${textPrimary} mt-1`}>
                  ${overview?.totalRevenue?.toLocaleString() || '0'}
                </p>
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +15% from last month
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {/* Revenue Chart (Line Chart - full width) */}
        <div className="grid grid-cols-1 mb-6 sm:mb-8">
          <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} p-4 sm:p-6 col-span-full`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Revenue Overview</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Monthly Revenue
              </div>
            </div>
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                  <XAxis dataKey="name" stroke={darkMode ? '#9CA3AF' : '#666'} fontSize={12} />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#666'} fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#2A2A2A' : '#fff', 
                      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      color: darkMode ? '#fff' : '#000'
                    }}
                    formatter={(value) => [`$${value?.toLocaleString()}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className={`h-full flex items-center justify-center ${textTertiary} min-h-[250px]`}>
                No revenue data available.
              </div>
            )}
          </div>
        </div>

        {/* Orders Per Day (Bar Chart) and Top Selling Items (Pie Chart) - side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Orders Per Day */}
          <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} p-4 sm:p-6`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Orders Per Day</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Daily Orders
              </div>
            </div>
            {ordersChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ordersChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                  <XAxis dataKey="name" stroke={darkMode ? '#9CA3AF' : '#666'} fontSize={12} />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#666'} fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#2A2A2A' : '#fff', 
                      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      color: darkMode ? '#fff' : '#000'
                    }}
                    formatter={(value) => [`${value}`, 'Orders']}
                  />
                  <Bar 
                    dataKey="orders" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className={`h-full flex items-center justify-center ${textTertiary} min-h-[250px]`}>
                No daily order data available.
              </div>
            )}
          </div>

          {/* Top Selling Items */}
          <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} p-4 sm:p-6`}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Top Selling Products</h3>
            </div>
            {topSellingChartData.length > 0 ? (
              <>
                <div className="flex items-center justify-center mb-4">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={topSellingChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {topSellingChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: darkMode ? '#2A2A2A' : '#fff', 
                          border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                          color: darkMode ? '#fff' : '#000'
                        }}
                        formatter={(value) => [`${value} sold`, 'Units']} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {topSellingChartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className={`text-sm font-medium ${textPrimary} truncate max-w-[150px]`}>{item.name}</span>
                      </div>
                      <span className={`text-sm ${textSecondary} whitespace-nowrap`}>{item.value} sold</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={`h-full flex items-center justify-center ${textTertiary} min-h-[250px]`}>
                No top selling product data available.
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} overflow-hidden`}>
          <div className={`p-4 sm:p-6 border-b ${borderColor}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Recent Orders</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={tableBg}>
                <tr>
                  <th className={`px-3 sm:px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>Order ID</th>
                  <th className={`px-3 sm:px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>Customer</th>
                  <th className={`px-3 sm:px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>Amount</th>
                  <th className={`px-3 sm:px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>Status</th>
                  <th className={`px-3 sm:px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider hidden sm:table-cell`}>Date</th>
                  <th className={`px-3 sm:px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>Items</th>
                </tr>
              </thead>
              <tbody className={`${cardBg} ${dividerColor} divide-y`}>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order._id} className={hoverBg}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${textPrimary}`}>
                        #{order._id.slice(-6)}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${textPrimary} truncate max-w-[120px]`}>
                        {order.user?.username || 'Unknown'}
                      </div>
                      <div className={`text-sm ${textTertiary} hidden sm:block truncate max-w-[120px]`}>
                        {order.user?.email || ''}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${textPrimary}`}>
                        ${order.totalPrice?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatus(order).color}`}>
                        {getOrderStatus(order).text}
                      </span>
                    </td>
                    <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm ${textTertiary} hidden sm:table-cell`}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div 
                        className="text-sm font-semibold cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                        onMouseEnter={(e) => handleMouseEnter(e, order)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {order.orderItems?.length || 0} items
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tooltip for order items */}
        {hoveredOrder && (
          <div 
            className={`fixed z-50 ${cardBg} border ${borderColor} rounded-lg shadow-lg p-4 max-w-xs order-tooltip`}
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y - 10,
              transform: 'translateY(-100%)'
            }}
          >
            <h4 className={`font-semibold text-sm mb-2 ${textPrimary}`}>Order Items:</h4>
            <div className="space-y-1">
              {hoveredOrder.orderItems?.map((item, index) => (
                <div key={index} className={`text-xs ${textSecondary}`}>
                  {item.name} x{item.quantity}
                </div>
              ))}
            </div>
            <div className={`mt-2 pt-2 border-t ${borderColor}`}>
              <div className={`text-xs ${textTertiary}`}>
                <strong>Ship to:</strong> {formatAddress(hoveredOrder.shippingAddress)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;