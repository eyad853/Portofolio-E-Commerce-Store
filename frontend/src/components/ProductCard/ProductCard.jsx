import React from 'react'
import { FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from "axios"

const ProductCard = ({name,img , review , numbersOfReviews , price , setIsOpen}) => {
  const handleAddToCart = async()=>{
    const data ={
    img,
    name,
    price,
}
try{
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/addInCart`, data)
}catch(error){
    console.log(error);
        }
}
  return (
    <div className='w-72 relative h-100 bg-white rounded-2xl transform hover:scale-102 transition-all duration-200'>
      <Link className='w-full h-full absolute' to="/product"></Link>
      {/* image */}
        <div className='w-full h-4/6 rounded-t-2xl bg-gray-300 flex justify-center items-center'>
          <img src={img} className='w-full h-full object-contain rounded-2xl'  alt="" />
        </div>

        {/* details */}
        <div className='flex flex-col'>
          {/* name */}
          <div className="font-bold text-xl mt-3">{name}</div>
          {/* review and price */}
          <div className="flex justify-between mt-2">
            {/* review */}
            <div className="flex gap-2 items-center">
              <div className="text-yellow-500 text-xl"><FaStar /></div>
              <div className="font-bold text-gray-400">{review}</div>
              <div className="font-bold text-gray-400">({numbersOfReviews} Reviews) </div>
            </div>
            {/* price */}
            <div className="text-2xl font-bold mr-3">
              ${price}
            </div>
          </div>
          {/* buttons */}
          <div className="flex justify-between mt-5">
            <button 
            onClick={handleAddToCart}
            className='w-32 h-10 transform hover:scale-105 transition-all duration-300 rounded-full border border-gray-600 ml-2 flex justify-center items-center text-black'>Add to Cart</button>
            <button 
            onClick={()=>{
              setIsOpen(true)
            }}
            className='w-32 h-10 transform hover:scale-105 transition-all duration-300 rounded-full bg-black text-white mr-2 flex justify-center items-center'>Buy now</button>
          </div>
        </div>
    </div>
  )
}

export default ProductCard