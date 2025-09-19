import React, { useState , useEffect } from 'react'
import D_Sidebar from '../../components/dashboardComponents/D_Sidebar/D_Sidebar'
import D_Nav from '../../components/dashboardComponents/D_Nav/D_Nav'
import { Outlet } from 'react-router-dom'

const DashboardLayOut = ({user, storeName, storeLogo, darkMode,dashboardError,setDashboardError}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
  if (dashboardError) {
    const timer = setTimeout(() => setDashboardError(''), 3000);
    return () => clearTimeout(timer);
  }
}, [dashboardError]);

  return (
    <div className={`flex w-screen h-screen overflow-hidden ${darkMode ? 'bg-[#1A1A1A]' : 'bg-white'}`}>
      <D_Sidebar 
        storeName={storeName} 
        storeLogo={storeLogo}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        darkMode={darkMode}
      />
      
      <div className='flex  flex-col flex-1 w-full'>
        <D_Nav 
          user={user}
          onToggleSidebar={toggleSidebar}
          darkMode={darkMode}
        />
        
        <div className={`flex-1 overflow-auto ${darkMode ? 'bg-[#1E1E1E]' : 'bg-neutral-100'} transition-colors duration-300`}>
          <Outlet />
        </div>
        {dashboardError && (
          <div className="fixed top-20 right-6 flex justify-center items-center text-white w-80 font-bold h-20 rounded-2xl bg-red-500 border border-red-600">
            {dashboardError}
          </div>
        )}
        
      </div>
    </div>
  )
}

export default DashboardLayOut