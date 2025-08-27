import React from 'react'
import { FaCaretLeft, FaUser } from 'react-icons/fa'
import { HiMenuAlt3 } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const D_Nav = ({user, onToggleSidebar,darkMode}) => {
  return (
    <div className='w-full h-16 flex items-center px-3 sm:px-5 justify-between border-neutral-300 dark:border-neutral-700 border-b bg-white dark:bg-[#1E1E1E] transition-colors duration-300'>
        
        {/* Left Section - Mobile Menu + Greeting */}
        <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-[#2A2A2A] text-neutral-600 dark:text-neutral-300 transition-colors duration-200"
            >
                <HiMenuAlt3 size={24} />
            </button>
            
            {/* Greeting - Hidden on very small screens */}
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-800 dark:text-white truncate">
                <span className="hidden sm:inline">Hello </span>
                <span className="truncate max-w-[150px] sm:max-w-none inline-block">
                    {user && user.username}
                </span>
            </div>
        </div>

        {/* Right Section - Back Button + User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
            {/* Back to Home Button */}
            <Link 
                to={'/home'} 
                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-[#2A2A2A] transition-colors duration-200"
                title="Back to Home"
            >
                <FaCaretLeft 
                    size={window.innerWidth < 640 ? 30 : 40} 
                    className='cursor-pointer text-neutral-600 dark:text-neutral-300' 
                />
            </Link>
            {/* Username - Hidden on mobile, shown on desktop */}
            <div className={`font-bold hidden sm:block truncate max-w-[120px] ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
                {user && user.username}
            </div>
        </div>
    </div>
  )
}

export default D_Nav