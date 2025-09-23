import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, ShoppingCart, Package, DollarSign, Calendar, Users, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Analytics = ({ overview, ordersPerDay, topSellingProducts, salesDistribution, monthlyOverview, darkMode }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Define theme colors
  const bgPrimary = darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50';
  const bgSecondary = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';
  const bgTertiary = darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-neutral-300' : 'text-gray-600';
  const textTertiary = darkMode ? 'text-neutral-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-neutral-600' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-[#1E1E1E]' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';

  const StatCard = ({ title, value, change, icon: Icon, color, prefix = '', suffix = '' }) => (
    <div className={`${bgSecondary} rounded-xl shadow-sm border ${borderColor} p-4 sm:p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${textSecondary}`}>{title}</p>
          <p className={`text-2xl sm:text-3xl font-bold ${textPrimary} mt-2 truncate`}>
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          <div className="flex items-center mt-2">
            {change >= 0 ? (
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 flex-shrink-0" />
            ) : (
              <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1 flex-shrink-0" />
            )}
            <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change)}%
            </span>
            <span className={`text-xs sm:text-sm ${textTertiary} ml-1 hidden sm:inline`}>vs last period</span>
          </div>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${color} flex-shrink-0 ml-3`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${bgSecondary} p-4 border ${borderColor} rounded-lg shadow-lg`}>
          <p className={`font-semibold ${textPrimary}`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.name.includes('Revenue') ? '$' : ''}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Process data functions
  const processOrdersPerDayData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      date: item._id,
      orders: item.count,
      revenue: item.count * 100 // Estimated revenue for demo
    }));
  };

  const processMonthlyOverviewData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      month: `${item._id.month}/${item._id.year}`,
      revenue: item.totalRevenue,
      orders: item.totalOrders
    }));
  };

  const processTopSellingData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    
    return data.map((item, index) => ({
      name: item.name,
      sales: item.totalSold,
      revenue: item.totalSold * 50, // Estimated revenue per unit
      color: colors[index % colors.length]
    }));
  };

  const processSalesDistributionData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    
    return data.map((item, index) => ({
      name: item._id || 'Unknown',
      sales: item.totalSold,
      color: colors[index % colors.length]
    }));
  };

  // Get processed data
  const ordersChartData = processOrdersPerDayData(ordersPerDay);
  const monthlyChartData = processMonthlyOverviewData(monthlyOverview);
  const topSellingChartData = processTopSellingData(topSellingProducts);
  const salesDistributionData = processSalesDistributionData(salesDistribution);

  // Calculate total products sold
  const totalProductsSold = topSellingProducts?.reduce((sum, product) => sum + product.totalSold, 0) || 0;

  return (
    <div className={`min-h-screen ${bgPrimary} p-3 sm:p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>Analytics Dashboard</h1>
              <p className={`${textSecondary} mt-2`}>Track your store's performance and growth</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`px-4 py-2 border ${borderColor} ${inputBg} ${textPrimary} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Revenue"
            value={overview?.totalRevenue || 0}
            change={12.5}
            icon={DollarSign}
            color="bg-green-500"
            prefix="$"
          />
          <StatCard
            title="Total Orders"
            value={overview?.totalOrders || 0}
            change={8.3}
            icon={ShoppingCart}
            color="bg-blue-500"
          />
          <StatCard
            title="Products Sold"
            value={totalProductsSold}
            change={-2.1}
            icon={Package}
            color="bg-purple-500"
          />
          <StatCard
            title="New Customers"
            value={overview?.newCustomers || 0}
            change={15.7}
            icon={Users}
            color="bg-orange-500"
          />
        </div>

        {/* Revenue Over Time Chart */}
        <div className={`${bgSecondary} rounded-xl shadow-sm border ${borderColor} p-4 sm:p-6 mb-6 sm:mb-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <h2 className={`text-lg sm:text-xl font-semibold ${textPrimary}`}>Orders Over Time</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className={`text-sm ${textSecondary}`}>Orders</span>
              </div>
            </div>
          </div>
          {ordersChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ordersChartData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  stroke={darkMode ? '#9CA3AF' : '#6b7280'}
                  fontSize={12}
                />
                <YAxis stroke={darkMode ? '#9CA3AF' : '#6b7280'} fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  strokeWidth={3}
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className={`h-64 sm:h-96 flex items-center justify-center ${textTertiary}`}>
              No orders data available
            </div>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Top Selling Products */}
          <div className={`${bgSecondary} rounded-xl shadow-sm border ${borderColor} p-4 sm:p-6`}>
            <h2 className={`text-lg sm:text-xl font-semibold ${textPrimary} mb-4 sm:mb-6`}>Top-Selling Products</h2>
            {topSellingChartData.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 max-h-80 overflow-y-auto">
                {topSellingChartData.map((product, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 sm:p-4 ${bgTertiary} rounded-lg`}>
                    <div className="flex items-center flex-1 min-w-0 mr-4">
                      <div 
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-3 flex-shrink-0"
                        style={{ backgroundColor: product.color }}
                      ></div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium ${textPrimary} truncate text-sm sm:text-base`}>{product.name}</p>
                        <p className={`text-xs sm:text-sm ${textSecondary}`}>{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-semibold ${textPrimary} text-sm sm:text-base`}>${product.revenue.toLocaleString()}</p>
                      <p className={`text-xs sm:text-sm ${textSecondary}`}>Est. Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`h-48 sm:h-64 flex items-center justify-center ${textTertiary}`}>
                No product data available
              </div>
            )}
          </div>

          {/* Sales Distribution Pie Chart */}
          <div className={`${bgSecondary} rounded-xl shadow-sm border ${borderColor} p-4 sm:p-6`}>
            <h2 className={`text-lg sm:text-xl font-semibold ${textPrimary} mb-4 sm:mb-6`}>Sales Distribution by Category</h2>
            {salesDistributionData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={salesDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="sales"
                    >
                      {salesDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} units`, 'Sales']}
                      labelFormatter={(label) => `Category: ${label}`}
                      contentStyle={{
                        backgroundColor: darkMode ? '#2A2A2A' : '#fff',
                        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                        color: darkMode ? '#fff' : '#000'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  {salesDistributionData.slice(0, 4).map((category, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div 
                        className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className={`${textSecondary} truncate`}>{category.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={`h-48 sm:h-64 flex items-center justify-center ${textTertiary}`}>
                No sales distribution data available
              </div>
            )}
          </div>
        </div>

        {/* Monthly Overview */}
        <div className={`${bgSecondary} rounded-xl shadow-sm border ${borderColor} p-4 sm:p-6`}>
          <h2 className={`text-lg sm:text-xl font-semibold ${textPrimary} mb-4 sm:mb-6`}>Monthly Overview</h2>
          {monthlyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                <XAxis 
                  dataKey="month" 
                  stroke={darkMode ? '#9CA3AF' : '#6b7280'} 
                  fontSize={12}
                />
                <YAxis 
                  stroke={darkMode ? '#9CA3AF' : '#6b7280'} 
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    color: darkMode ? '#9CA3AF' : '#6b7280' 
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" fill="#10b981" name="Orders" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={`h-64 sm:h-96 flex items-center justify-center ${textTertiary}`}>
              No monthly data available
            </div>
          )}
        </div>

        {/* Mobile-specific summary */}
        <div className="block sm:hidden mt-6">
          <div className={`${bgSecondary} rounded-xl shadow-sm border ${borderColor} p-4`}>
            <h3 className={`text-lg font-semibold ${textPrimary} mb-3`}>Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${textPrimary}`}>{overview?.totalOrders || 0}</div>
                <div className={`text-sm ${textSecondary}`}>Total Orders</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${textPrimary}`}>${(overview?.totalRevenue || 0).toLocaleString()}</div>
                <div className={`text-sm ${textSecondary}`}>Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;