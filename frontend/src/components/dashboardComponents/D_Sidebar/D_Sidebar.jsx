import React from 'react'
import { FaShoppingCart } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import { IoReorderThreeOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { TbUsersGroup } from "react-icons/tb";
import { SiSimpleanalytics } from "react-icons/si";
import { TbCategory } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import { HiX } from "react-icons/hi";
import axios from 'axios';

const D_Sidebar = ({storeName, storeLogo, isOpen, onClose, darkMode}) => {

    const logoutUser = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/settings/logoutAccount`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                window.location.href = '/login';
            } else {
                console.error('Logout failed with status:', response.status);
            }
        } catch (error) {
            console.error('Logout error:', error.response?.data?.message || error.message);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            
            {/* Sidebar */}
            <div className={`
                fixed lg:relative z-50 lg:z-auto
                w-80 lg:w-1/5 h-screen 
                border-r border-neutral-300 ${darkMode ? 'dark:border-neutral-700' : ''}
                px-2 shadow-2xl 
                ${darkMode ? 'bg-[#1A1A1A]' : 'bg-white'}
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 lg:hidden p-2 rounded-md ${darkMode ? 'hover:bg-[#2A2A2A] text-neutral-300' : 'hover:bg-neutral-100 text-neutral-600'}`}
                >
                    <HiX size={20} />
                </button>

                {/* Store Header */}
                <div className={`h-[10%] flex gap-5 text-2xl font-bold justify-center items-center ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
                    <div className="h-full">
                        <img src={storeLogo} className='w-full h-full object-contain' alt="" />
                    </div>
                    <div className="truncate">
                        {storeName}
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col space-y-1">
                    <div className={`flex rounded-md px-3 cursor-pointer items-center gap-2.5 font-semibold hover:text-white ${darkMode ? 'hover:bg-purple-600 text-neutral-200' : 'hover:bg-purple-500 text-neutral-700'} transition-all duration-300`}>
                        <Link to='/admin/dashboard/' onClick={onClose} className='flex items-center gap-2.5 w-full h-full py-5'>
                            <LuLayoutDashboard className="flex-shrink-0" />
                            <span className="truncate">Dashboard</span>
                        </Link>
                    </div>
                    <div className={`flex rounded-md px-3 cursor-pointer items-center gap-2.5 font-semibold hover:text-white ${darkMode ? 'hover:bg-purple-600 text-neutral-200' : 'hover:bg-purple-500 text-neutral-700'} transition-all duration-300`}>
                        <Link to='/admin/dashboard/Products' onClick={onClose} className='flex items-center gap-2.5 w-full h-full py-5'>
                            <IoCartOutline className="flex-shrink-0" />
                            <span className="truncate">Products</span>
                        </Link>
                    </div>
                    <div className={`flex rounded-md px-3 cursor-pointer items-center gap-2.5 font-semibold hover:text-white ${darkMode ? 'hover:bg-purple-600 text-neutral-200' : 'hover:bg-purple-500 text-neutral-700'} transition-all duration-300`}>
                        <Link to='/admin/dashboard/Categories' onClick={onClose} className='flex items-center gap-2.5 w-full h-full py-5'>
                            <TbCategory className="flex-shrink-0" />
                            <span className="truncate">Categories</span>
                        </Link>
                    </div>
                    <div className={`flex rounded-md px-3 cursor-pointer items-center gap-2.5 font-semibold hover:text-white ${darkMode ? 'hover:bg-purple-600 text-neutral-200' : 'hover:bg-purple-500 text-neutral-700'} transition-all duration-300`}>
                        <Link to='/admin/dashboard/Orders' onClick={onClose} className='flex items-center gap-2.5 w-full h-full py-5'>
                            <IoReorderThreeOutline className="flex-shrink-0" />
                            <span className="truncate">Orders</span>
                        </Link>
                    </div>
                    <div className={`flex rounded-md px-3 cursor-pointer items-center gap-2.5 font-semibold hover:text-white ${darkMode ? 'hover:bg-purple-600 text-neutral-200' : 'hover:bg-purple-500 text-neutral-700'} transition-all duration-300`}>
                        <Link to='/admin/dashboard/Customers' onClick={onClose} className='flex items-center gap-2.5 w-full h-full py-5'>
                            <TbUsersGroup className="flex-shrink-0" />
                            <span className="truncate">Customers</span>
                        </Link>
                    </div>
                    <div className={`flex rounded-md px-3 cursor-pointer items-center gap-2.5 font-semibold hover:text-white ${darkMode ? 'hover:bg-purple-600 text-neutral-200' : 'hover:bg-purple-500 text-neutral-700'} transition-all duration-300`}>
                        <Link to='/admin/dashboard/Analytics' onClick={onClose} className='flex items-center gap-2.5 w-full h-full py-5'>
                            <SiSimpleanalytics className="flex-shrink-0" />
                            <span className="truncate">Analytics</span>
                        </Link>
                    </div>
                    <div className={`flex rounded-md px-3 cursor-pointer items-center gap-2.5 font-semibold hover:text-white ${darkMode ? 'hover:bg-purple-600 text-neutral-200' : 'hover:bg-purple-500 text-neutral-700'} transition-all duration-300`}>
                        <Link to='/admin/dashboard/Settings' onClick={onClose} className='flex items-center gap-2.5 w-full h-full py-5'>
                            <CiSettings className="flex-shrink-0" />
                            <span className="truncate">Settings</span>
                        </Link>
                    </div>

                    {/* Logout */}
                    <div 
                        onClick={() => {
                            onClose();
                            logoutUser();
                        }}
                        className={`flex py-5 rounded-md px-3 cursor-pointer items-center gap-2.5 font-semibold hover:text-red-500 ${darkMode ? 'hover:bg-red-900/20 text-neutral-200' : 'hover:bg-red-50 text-neutral-700'} transition-all duration-300`}
                    >
                        <CiLogout className="flex-shrink-0" />
                        <span className="truncate">LogOut</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default D_Sidebar