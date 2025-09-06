import React, { useEffect, useState } from 'react'
import { HiUsers } from "react-icons/hi2";
import { FaUserCheck, FaUserMinus } from "react-icons/fa6";
import axios from 'axios';
import { IoSearchOutline } from 'react-icons/io5';

const Customers = ({ socket, darkMode }) => {
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // Define theme colors
  const bgPrimary = darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50';
  const bgSecondary = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';
  const bgTertiary = darkMode ? 'bg-[#1E1E1E]' : 'bg-neutral-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-neutral-300' : 'text-gray-600';
  const textTertiary = darkMode ? 'text-neutral-400' : 'text-gray-400';
  const borderColor = darkMode ? 'border-neutral-600' : 'border-neutral-300';
  const borderColorLight = darkMode ? 'border-neutral-700' : 'border-neutral-400';
  const inputBg = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';
  const hoverBg = darkMode ? 'hover:bg-[#1E1E1E]' : 'hover:bg-gray-50';

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/customers/getAll`)
      if (response) {
        setCustomers(response.data.usersWithStatus)
        console.log('customers has been fetched');
      }
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(customer => {
    const name = customer?.user?.username?.toLowerCase() || ''
    const email = customer?.user?.email?.toLowerCase() || ''
    const search = searchTerm.toLowerCase()
    return name.includes(search) || email.includes(search)
  })

  const activeCount = customers.filter(c => c.isOnline).length
  const inactiveCount = customers.filter(c => !c.isOnline).length

  return (
    <div className={`w-full h-full overflow-auto hide-scrollbar pb-4 sm:pb-6 px-3 sm:px-6 lg:px-10 pt-4 sm:pt-6 ${bgPrimary}`}>
      {/* Statistics Cards */}
      <div className={`${bgSecondary} shadow-2xl gap-3 sm:gap-5 rounded-md px-3 sm:px-5 py-3 h-auto sm:h-32 flex flex-col sm:flex-row items-center justify-around`}>
        
        {/* Total Users Card */}
        <div className={`w-full sm:w-1/3 p-3 sm:p-2 h-20 sm:h-full ${bgSecondary} shadow-2xl border ${borderColor} rounded-md flex justify-center items-center gap-2 sm:gap-3`}>
          <div className={`w-12 sm:w-16 h-12 sm:h-16 rounded-full flex justify-center items-center ${bgTertiary} text-2xl sm:text-4xl lg:text-5xl ${textSecondary}`}>
            <HiUsers />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className={`${textTertiary} font-semibold text-xs sm:text-sm`}>Total Users</div>
            <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${textPrimary}`}>{customers.length}</div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className={`w-full sm:w-1/3 p-3 sm:p-2 h-20 sm:h-full ${bgSecondary} shadow-2xl border ${borderColor} rounded-md flex justify-center items-center gap-2 sm:gap-3`}>
          <div className={`w-12 sm:w-16 h-12 sm:h-16 rounded-full flex justify-center items-center ${bgTertiary} text-2xl sm:text-4xl lg:text-5xl ${textSecondary}`}>
            <FaUserCheck />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className={`${textTertiary} font-semibold text-xs sm:text-sm`}>Active Users</div>
            <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${textPrimary}`}>{activeCount}</div>
          </div>
        </div>

        {/* Inactive Users Card */}
        <div className={`w-full sm:w-1/3 p-3 sm:p-2 h-20 sm:h-full ${bgSecondary} shadow-2xl border ${borderColor} rounded-md flex justify-center items-center gap-2 sm:gap-3`}>
          <div className={`w-12 sm:w-16 h-12 sm:h-16 rounded-full flex justify-center items-center ${bgTertiary} text-2xl sm:text-4xl lg:text-5xl ${textSecondary}`}>
            <FaUserMinus />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className={`${textTertiary} font-semibold text-xs sm:text-sm`}>Inactive Users</div>
            <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${textPrimary}`}>{inactiveCount}</div>
          </div>
        </div>
      </div>

      {/* Customers List */}
      {loading ? (
        <div className='w-full h-full flex justify-center items-center'>
          <div className="w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 rounded-full border-y-2 border-blue-600 animate-spin"></div>
        </div>
      ) : (
        <div className={`${bgSecondary} shadow-2xl min-h-[400px] px-3 sm:px-6 lg:px-8 rounded-xl overflow-hidden flex-1 mt-4 sm:mt-8`}>
          {customers && customers.length > 0 ? (
            <div className="w-full h-full">
              {/* Header Section */}
              <div className={`h-24 sm:h-32 border-b ${borderColor} flex flex-col justify-center`}>
                {/* Title and Search */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 py-4">
                  <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${textPrimary}`}>All Customers</div>
                  
                  {/* Search Bar */}
                  <div className={`h-8 sm:h-10 flex ${borderColorLight} rounded-full border ${inputBg} w-full sm:w-auto`}>
                    <div className={`rounded-l-full w-8 sm:w-10 text-lg sm:text-xl flex justify-center items-center h-full ${textSecondary}`}>
                      <IoSearchOutline />
                    </div>
                    <input 
                      type="text" 
                      className={`outline-none h-full w-full sm:w-48 lg:w-60 px-2 rounded-r-full ${inputBg} ${textPrimary} text-sm sm:text-base`}
                      placeholder='Search customers...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Desktop Table Headers */}
                <div className={`hidden lg:flex h-8 ${textTertiary} font-semibold text-sm`}>
                  <div className="flex justify-start items-center h-full w-[20%]">Customer Name</div>
                  <div className="flex justify-start items-center h-full w-[25%]">Email</div>
                  <div className="flex justify-start items-center h-full w-[20%]">Phone Number</div>
                  <div className="flex justify-start items-center h-full w-[20%]">Country</div>
                  <div className="flex justify-start items-center h-full w-[15%]">Status</div>
                </div>
              </div>

              {/* Results Count */}
              <div className={`py-3 ${textSecondary} text-sm`}>
                Showing {filteredCustomers.length} of {customers.length} customers
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                {filteredCustomers.map((customer, index) => (
                  <div 
                    key={customer._id} 
                    className={`h-12 border-b ${borderColor} flex font-semibold ${textPrimary} ${hoverBg} transition-colors duration-200`}>
                    
                    <div className="flex justify-start items-center h-full w-[20%] overflow-hidden">
                      <div className="truncate">{customer.user.username}</div>
                    </div>
                    
                    <div className="flex justify-start items-center h-full w-[25%] overflow-hidden">
                      <div className="truncate">{customer.user.email}</div>
                    </div>
                    
                    <div className="flex justify-start items-center h-full w-[20%] overflow-hidden">
                      <div className="truncate">
                        {customer.user.phoneNumber || <span className='text-yellow-500'>Not Provided</span>}
                      </div>
                    </div>
                    
                    <div className="flex justify-start items-center h-full w-[20%] overflow-hidden">
                      <div className="truncate">
                        {customer.user.location || <span className='text-yellow-500'>Not Provided</span>}
                      </div>
                    </div>
                    
                    <div className="flex justify-start items-center h-full w-[15%]">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        customer.isOnline 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : darkMode 
                            ? 'bg-red-900/30 text-red-400 border border-red-700'
                            : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {customer.isOnline ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 pb-6">
                {filteredCustomers.map((customer, index) => (
                  <div 
                    key={customer._id} 
                    className={`${bgTertiary} rounded-lg p-4 border ${borderColor} shadow-sm`}>
                    
                    {/* Customer Name and Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`font-semibold text-lg ${textPrimary} truncate flex-1 mr-3`}>
                        {customer.user.username}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        customer.isOnline 
                          ? 'bg-green-100 text-green-800' 
                          : darkMode 
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.isOnline ? "Active" : "Inactive"}
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-2">
                      <div>
                        <div className={`text-xs ${textTertiary} mb-1`}>Email</div>
                        <div className={`text-sm ${textSecondary} truncate`}>{customer.user.email}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className={`text-xs ${textTertiary} mb-1`}>Phone</div>
                          <div className={`text-sm ${textSecondary} truncate`}>
                            {customer.user.phoneNumber || <span className='text-yellow-500'>Not Provided</span>}
                          </div>
                        </div>
                        
                        <div>
                          <div className={`text-xs ${textTertiary} mb-1`}>Country</div>
                          <div className={`text-sm ${textSecondary} truncate`}>
                            {customer.user.location || <span className='text-yellow-500'>Not Provided</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Results Found */}
              {filteredCustomers.length === 0 && searchTerm && (
                <div className={`text-center py-12 ${textSecondary}`}>
                  <div className="text-4xl mb-4">🔍</div>
                  <div className="text-lg font-semibold mb-2">No customers found</div>
                  <div className="text-sm">Try adjusting your search criteria</div>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={`flex flex-col w-full h-full justify-center items-center ${textSecondary}`}>
              <div className="text-6xl mb-4">👥</div>
              <div className="text-xl font-semibold mb-2">No Customers Yet</div>
              <div className="text-sm text-center max-w-md">
                When customers create accounts, they will appear here for you to manage and track.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={`mt-4 p-4 rounded-md ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'} text-center`}>
          An error occurred while loading customers. Please try again.
          <button 
            onClick={() => {
              setError(false);
              fetchCustomers();
            }}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}

export default Customers