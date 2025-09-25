import React from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { Link } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import Nav from '../../../components/Nav/Nav';

const FirstPart = ({user,darkMode , setDarkMode,storeName,storeLogo}) => {

  return (
    <div className='w-full h-100 relative'>
    <img src={darkMode?"d_bg.jpg":"/bg.jpg"} className='absolute w-full h-full ' alt="" />
    {/* nav */}
    <Nav 
     user={user}
     darkMode={darkMode}
     setDarkMode={setDarkMode}
     storeName={storeName}
    storeLogo={storeLogo} 
     />
     
    <div className={`absolute bottom-0 flex items-center justify-between right-4 md:right-20 left-4 md:left-20 h-12 md:h-16 rounded-t-2xl  ${darkMode?"bg-[#1C1C1C] text-[#EAEAEA]":"bg-white"}`}>
        <div className='ml-4 md:ml-7 text-xl md:text-3xl font-bold'>
            Get what you need
        </div>
    </div>
</div>
  )
}

export default FirstPart