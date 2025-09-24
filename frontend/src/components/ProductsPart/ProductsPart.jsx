import React, { useEffect, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoIosStarOutline } from "react-icons/io";
import { IoStar } from "react-icons/io5";

const ProductsPart = ({currencySymbol,products ,handleShow ,darkMode ,updateProductReview,searchCategory, setProducts , handleAddToCart}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 9;

  const filteredProducts = searchCategory === 'all'
    ? products
    : products.filter((product) => product.category.category === searchCategory);

  const calculateAverageRating = (product) => {
    if (!product.reviews || product.reviews.length === 0) return 0
    const total = product.reviews.reduce((sum, review) => sum + review.review, 0)
    return (total / product.reviews.length).toFixed(1)
  }

  const StarIcon = ({ filled, className, ...props }) => (
    filled ? <IoStar className={className} {...props} /> : <IoIosStarOutline className={className} {...props} />
  )

  const renderStars = (product) => {
    const rating = calculateAverageRating(product)
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - Math.ceil(rating)

    return (
      <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={i} filled={true} className="text-yellow-500" />
        ))}
        {hasHalfStar && <StarIcon filled={true} className="text-yellow-500" />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={i + fullStars + (hasHalfStar ? 1 : 0)} filled={false} className="text-gray-300" />
        ))}
      </div>
    )
  }

  // Calculate the products to display for current page
  const startIndex = currentPage * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };


  return (
    <div className={`h-full w-full lg:w-4/5 ${darkMode?"bg-[#1A1A1A] text-[#EAEAEA]":"bg-white"} flex flex-col`}>
      {products?.length > 0 ? (
        <div className='flex-1'>
          <div className="grid p-3 md:p-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7 w-full flex-1">
            {currentProducts.map((product) => (
              <div 
                key={product._id || product.id} 
                className={`border ${darkMode?"bg-[#1E1E1E]":""} relative transform hover:scale-105 transition-all duration-300 cursor-pointer rounded-xl border-neutral-300`}
              >
                <Link to={`/product/${product._id}`} className='absolute inset-0 z-10'></Link>
                {/* mainImage  */}
                <div className="h-48 md:h-56 lg:h-64 bg-neutral-200 flex justify-center items-center">
                  <img 
                    src={`${import.meta.env.VITE_BACKEND_URL}${product.mainImage}`} 
                    className='w-full h-full object-contain' 
                  />
                </div>

                {/* second part */}

                <div className="px-2 py-2 md:py-3">
                  <div className={`line-clamp-1 ${darkMode?"text-[#FFFFFF]":""} text-lg md:text-xl lg:text-2xl font-bold`}>{product.name}</div>
                  <div className={`line-clamp-1 ${darkMode?"text-[#A0A0A0]":""} font-semibold text-xs mt-1.5`}>{product.description}</div>

                  <div className="flex flex-col md:flex-row justify-between mt-1.5 items-start md:items-center gap-2 md:gap-0">
                    {renderStars(product)}
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="font-semibold text-blue-600 text-sm md:text-base">
                        {product.quality}
                      </div>
                      <div className={`font-bold ${darkMode?"text-[#3B82F6]":""} text-lg md:text-xl lg:text-2xl`}>
                        {`${currencySymbol}${product.price}`}
                      </div>
                    </div>
                  </div>

                  <div className="w-full px-3 h-9 md:h-10 mt-3 md:mt-5">
                    <div 
                    onClick={(e)=>{
                       e.preventDefault(); // stop Link navigation
                      e.stopPropagation(); // stop bubbling
                      handleAddToCart(product._id)
                      if(user){
                        handleShow()
                      }
                    }}
                    className={`w-full relative overflow-visible h-full z-20 ${darkMode?"bg-[#3B82F6] text-[#FFFFFF] hover:bg-[#2563EB]":"bg-gradient-to-r from-blue-500 to-blue-600"}  rounded-xl transform hover:scale-105 transition-all duration-300 z-10 font-semibold flex justify-center items-center text-white text-sm md:text-base`}>Add To Cart</div>
                  </div>
                </div>

              </div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className={`flex justify-center ${darkMode?'text-white':""} items-center gap-2 md:gap-4 p-3 md:p-5`}>
              <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className={`px-4 md:px-6 py-2 text-sm md:text-base rounded-lg cursor-pointer z-50 font-medium transition-all duration-200 ${
                  currentPage === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                }`}
              >
                Previous
              </button>
              
              <span className={`${darkMode?"text-white":"text-gray-600"} font-medium text-sm md:text-base`}>
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
                className={`px-4 md:px-6 py-2 text-sm md:text-base rounded-lg cursor-pointer z-50 font-medium transition-all duration-200 ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center text-2xl md:text-4xl font-bold">
          No products Yet
        </div>
      )}
    </div>
  );
};

export default ProductsPart;