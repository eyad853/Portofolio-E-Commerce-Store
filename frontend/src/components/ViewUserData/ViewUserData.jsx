import axios from 'axios';
import React from 'react'
import { FaUser } from 'react-icons/fa'

const ViewUserData = ({user , darkMode}) => {
    const logoutUser = async () => {
        try {
            const response = await axios.delete('http://localhost:8000/settings/logoutAccount', {
                withCredentials: true, // to send session cookies
            });
            
            if (response.status === 200) {
                // Successfully logged out
                window.location.href = '/login'; // or navigate('/login') if using React Router
            } else {
                console.error('Logout failed with status:', response.status);
            }
        } catch (error) {
            console.error('Logout error:', error.response?.data?.message || error.message);
        }
    };
    
    return (
        <div className={`absolute top-12 md:top-16 -right-2 md:-right-16 lg:-right-20 
            w-48 sm:w-56 md:w-60 lg:w-64
            min-h-[12rem] sm:min-h-[13rem] md:min-h-[14rem]
            rounded-xl border shadow-2xl z-50
            ${darkMode ? "bg-neutral-800 border-neutral-700" : "bg-neutral-100 border-neutral-300"} 
            flex justify-center items-center flex-col gap-3 sm:gap-3.5 md:gap-4
            p-3 sm:p-4 md:p-5`}>
            
            {/* User Avatar */}
            <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 
                overflow-hidden text-2xl sm:text-3xl md:text-4xl  
                ${darkMode ? "border-2 border-white" : "border-2 border-gray-300"}  
                relative rounded-full bg-gray-400 flex justify-center items-end`}>
                {user && user.avatar ? (
                    <div className='w-full h-full rounded-full'>
                        <img src={user.avatar} className='w-full h-full object-cover rounded-full' alt="" />
                    </div>
                ) : (
                    <FaUser />
                )}
            </div>
            
            {/* Username */}
            <div className={`font-semibold text-sm sm:text-base md:text-lg line-clamp-1 text-center px-2 
                ${darkMode ? "text-white" : "text-gray-800"}`}>
                {user.username}
            </div>
            
            {/* Logout Button */}
            <div className="h-8 sm:h-9 md:h-10 w-full px-2 sm:px-3">
                <button 
                    onClick={() => {
                        logoutUser()
                    }}
                    className="w-full h-full bg-red-500 hover:bg-red-600 active:bg-red-700 
                        transition-all duration-300 rounded-lg sm:rounded-xl md:rounded-2xl 
                        flex justify-center items-center text-white font-medium
                        text-xs sm:text-sm md:text-base
                        focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50">
                    LogOut
                </button>
            </div>
        </div>
    )
}

export default ViewUserData