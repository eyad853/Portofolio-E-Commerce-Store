import React, { useEffect, useRef, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import ViewUserData from '../ViewUserData/ViewUserData'

const Nav = ({user , darkMode , storeName,storeLogo,setIsOpen}) => {
    const [viewUserData , setViewUserData]=useState(false)
    const profileRef = useRef(null)
   // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setViewUserData(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
   <div className={`absolute z-10 top-0 flex border shadow-xl  items-center justify-between    
    right-4 md:right-20 left-4 md:left-20 h-12 md:h-16 rounded-b-2xl ${darkMode?"bg-[#1C1C1C] border-neutral-800 text-[#EAEAEA]":"bg-white border-neutral-400"}`}>
        {/* store name */}
        <div className="h-full flex gap-2 md:gap-5 text-lg md:text-2xl font-bold justify-center items-center">
            <div className="h-full">
                <img src={storeLogo} className='w-full h-full object-contain' alt="" />
            </div>
            <div className="hidden sm:block">
                {storeName}
            </div>
        </div>
        
        {/* Pages */}
        <div className='flex gap-2 sm:gap-6 lg:gap-10 font-bold text-xs sm:text-base'>
            <Link className='cursor-pointer' to='/home'>Shop</Link>
            <Link className='cursor-pointer' to='/cart'>Cart</Link>
            <Link className='cursor-pointer' to='/userOrders'>Orders</Link>
            {user&&user?.role==="admin"&&<Link className='cursor-pointer' to='/admin/dashboard'>Dashboard</Link>}
        </div>
        
        {/* profile , search */}
        <div 
        ref={profileRef}
        onClick={()=>{
            setViewUserData(prev=>!prev)
        }}
        className='flex gap-1 md:gap-2 cursor-pointer mr-2 md:mr-7 items-center relative'>
            <div className={`w-8 md:w-10 h-8 md:h-10 overflow-hidden text-2xl md:text-4xl  ${darkMode?"border-2 border-white":""}  relative rounded-full bg-gray-400 flex justify-center items-end`}>
                {user&&user.avatar?(
                    <div className='w-full h-full rounded-full'>
                        <img src={user.avatar} className='w-full h-full object-cover rounded-full' alt="" />
                    </div>
                ):(
                    <FaUser />
                )}
            </div>
            <div className='font-semibold text-sm md:text-base hidden sm:block'>
                {user&&user.username}
            </div>
            {viewUserData&&<ViewUserData user={user} darkMode={darkMode}/>}
        </div>
    </div>
  )
}

export default Nav