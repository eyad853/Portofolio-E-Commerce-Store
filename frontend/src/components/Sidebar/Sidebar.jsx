import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Sidebar = ({searchCategory, setSearchCategory,darkMode}) => {
  const [categories , setCategories]=useState([])
  
  const fetchCategories = async()=>{
    try{
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/category/getAll`)
      if(response){
        setCategories(response.data.allCategories)
      }
    }catch(err){
      console.log(err);
    }
  }
  
  useEffect(()=>{
    fetchCategories()
  },[])
  
  return (
    <div className={`h-auto lg:min-h-full flex flex-col ${darkMode?"bg-[#1A1A1A] text-[#DADADA]":"bg-white"} shadow-2xl items-center w-full lg:w-1/5 border-b lg:border-b-0 lg:border-r border-gray-400 lg:rounded-br-2xl`}>
      <div className='text-xl md:text-2xl lg:text-3xl font-medium mt-4 lg:mt-8'>Categories</div>
      <div className='flex-1 flex lg:flex-col gap-1 mt-4 lg:mt-8 font-medium text-base md:text-lg lg:text-xl w-full border-gray-400 overflow-x-auto lg:overflow-x-visible'>
        <div
          onClick={() => setSearchCategory('all')}
          className={`h-10 lg:h-auto flex justify-center items-center font-semibold text-base md:text-lg lg:text-xl transition-all duration-300 
             cursor-pointer py-3 lg:py-6 px-4 lg:px-0 whitespace-nowrap lg:whitespace-normal flex-shrink-0 lg:flex-shrink ${searchCategory === 'all'? darkMode? 'bg-[#3B82F6]': 'bg-neutral-300': darkMode? 'hover:bg-[#2A2A2A]': 'hover:bg-neutral-300'}`}
        >
          All
        </div>
        {categories&&categories.length>0?(
          <div className="w-full h-full flex lg:flex-col">
            {categories.map(category=>(
              <div
               key={category._id}
               onClick={()=>{
                setSearchCategory(category.category)
              }}
              className={`h-10 lg:h-auto flex justify-center items-center font-semibold text-base md:text-lg lg:text-xl transition-all duration-300 
               cursor-pointer py-3 lg:py-6 px-4 lg:px-0 whitespace-nowrap lg:whitespace-normal flex-shrink-0 lg:flex-shrink ${searchCategory === category.category? darkMode? 'bg-[#3B82F6]': 'bg-neutral-300': darkMode? 'hover:bg-[#2A2A2A]': 'hover:bg-neutral-300'}`}>
                {category.category}
              </div>
            ))}
          </div>
        ):(
          <div className="w-full h-full flex justify-center items-center text-sm md:text-base lg:text-lg">No Categories yet</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;