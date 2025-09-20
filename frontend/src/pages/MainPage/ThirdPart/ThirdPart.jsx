import React, { useEffect, useState } from 'react';
import { Twitter, Facebook, Linkedin, Instagram, Star } from 'lucide-react';
import {Link} from 'react-router-dom'

const ThirdPart = ({handleShow,currencySymbol,darkMode, products , setProducts  ,handleAddToCart}) => {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (products && Array.isArray(products)) {
            setRecommendedProducts(products.filter(product => product.inRecomendations === true));
        }
    }, [products]);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email) {
            alert(`Thank you! We'll send updates to ${email}`);
            setEmail('');
        }
    }

    const calculateAverageRating = (product) => {
        if (!product.reviews || product.reviews.length === 0) return 0
        const total = product.reviews.reduce((sum, review) => sum + review.review, 0)
        return (total / product.reviews.length).toFixed(1)
    }

    const StarIcon = ({ filled, className, ...props }) => (
        filled ? <Star className={className} {...props} fill="currentColor" /> : <Star className={className} {...props} />
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

    return (
        <div className={`relative w-full pt-16  ${darkMode?"bg-[#1A1A1A] text-[#EAEAEA]":"bg-white"} min-h-screen`}>
            <div className='px-4 md:px-20'>
                <h1 className='text-2xl md:text-4xl ml-2 md:ml-14 font-bold'>
                    Explore our Recommendations 
                </h1>
                
                {recommendedProducts.length > 0 ? (
                    <div className="w-full h-120 px-1 md:px-3 py-3 flex overflow-x-auto hide-scrollbar gap-4 md:gap-10 mt-8">
                        {recommendedProducts.map(product => (
                            <div 
                            key={product._id || product.id} 
                            className={`border ${darkMode?"bg-[#1E1E1E]":""}  min-w-72 md:w-80 relative transform hover:scale-105 transition-all duration-300 cursor-pointer rounded-xl border-neutral-300`}
                                          >
                                            <Link to={`/product/${product._id}`} className='absolute inset-0 z-10'></Link>
                                            {/* mainImage  */}
                                            <div className="h-3/5 bg-neutral-200 flex justify-center items-center">
                                              <img 
                                                src={`${import.meta.env.VITE_BACKEND_URL}${product.mainImage}`} 
                                                className='w-full h-full object-contain' 
                                              />
                                            </div>
                            
                                            {/* second part */}
                            
                                            <div className="h-2/5 px-2 py-1">
                                              <div className={`line-clamp-1 ${darkMode?"text-[#FFFFFF]":""} text-xl md:text-2xl font-bold`}>{product.name}</div>
                                              <div className={`line-clamp-1 ${darkMode?"text-[#A0A0A0]":""} font-semibold text-xs mt-1.5`}>{product.description}</div>
                            
                                              <div className="flex flex-col md:flex-row justify-between mt-1.5 items-start md:items-center gap-2">
                                                {renderStars(product)}
                                                <div className="flex items-center gap-2 md:gap-4">
                                                  <div className="font-semibold text-blue-600 text-sm">
                                                    {product.quality}
                                                  </div>
                                                  <div className={`font-bold ${darkMode?"text-[#3B82F6]":""} text-xl md:text-2xl`}>
                                                    {`${currencySymbol}${product.price}`}
                                                  </div>
                                                </div>
                                              </div>
                            
                                              <div className="w-full relative overflow-visible px-3 h-10 mt-5">
                                                <div 
                                                onClick={(e)=>{
                                                    e.preventDefault(); // stop Link navigation
                                                    e.stopPropagation(); // stop bubbling
                                                    handleShow()
                                                    handleAddToCart(product._id)
                                                }}
                                                className={`w-full h-full relative overflow-visible ${darkMode?"bg-[#3B82F6] text-[#FFFFFF] hover:bg-[#2563EB]":"bg-gradient-to-r from-blue-500 to-blue-600"}  rounded-xl transform hover:scale-105 z-20 transition-all duration-300 font-semibold flex justify-center items-center text-white`}>Add To Cart</div>
                                              </div>
                                            </div>
                            
                                          </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-8 text-gray-500">No recommended products available</div>
                )}


                <div className={`w-full mt-12 md:mt-24 `}>
                    {/* Newsletter Section */}
                    <div className='w-full rounded-2xl text-white flex flex-col p-6 md:p-10 bg-gradient-to-br from-neutral-700 to-neutral-800 min-h-60 md:h-72'>
                        <div className="w-full md:w-60 font-medium text-2xl md:text-4xl mb-6 md:h-40">
                            Ready to get our new Stuff
                        </div>
                        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                            <div onSubmit={handleEmailSubmit} className="w-full md:w-80 rounded-full h-10 flex items-center">
                                <input 
                                    type="email" 
                                    placeholder='your email' 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='h-9 px-3 rounded-l-full pb-0.5 flex-1 md:w-72 text-black text-lg md:text-xl bg-white outline-none' 
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={handleEmailSubmit}
                                    className='bg-black w-16 md:w-20 h-full rounded-r-full flex justify-center items-center hover:bg-gray-800 transition-colors text-sm md:text-base'
                                >
                                    send
                                </button>
                            </div>  
                            <div className="flex flex-col">
                                <h1 className='text-lg md:text-xl'>
                                    Stuffs that you need
                                </h1>
                                <p className='text-sm text-gray-400'>
                                    We wanna listen to your needs, identify the best approach and start to sell it here
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className='w-full min-h-60 mt-14 flex flex-col md:flex-row justify-between gap-8 md:gap-0'>
                        <div className="w-full md:w-60 flex flex-col md:flex-row">
                            <div className="flex flex-col w-full md:w-1/2 mb-6 md:mb-0">
                                <h1 className='font-bold text-xl'>About</h1>
                                <div className='flex flex-col text-gray-400 mt-3 space-y-1'>
                                    <div className="hover:text-gray-600 cursor-pointer">blog</div>
                                    <div className="hover:text-gray-600 cursor-pointer">meet the team</div>
                                    <div className="hover:text-gray-600 cursor-pointer">contact us</div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full md:w-1/2">
                                <h1 className='font-bold text-xl'>Support</h1>
                                <div className='flex flex-col text-gray-400 mt-3 space-y-1'>
                                    <div className="hover:text-gray-600 cursor-pointer">contact us</div>
                                    <div className="hover:text-gray-600 cursor-pointer">shipping</div>
                                    <div className="hover:text-gray-600 cursor-pointer">return</div>
                                    <div className="hover:text-gray-600 cursor-pointer">FAQ</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-60 relative flex flex-col">
                            <div className="flex flex-col md:absolute md:bottom-0 md:mb-20">
                                <h1 className='text-gray-400 font-bold mb-3'>Social media</h1>
                                <div className='flex gap-2'>
                                    <div className='w-10 h-10 transform hover:scale-105 transition-all duration-200 rounded-full flex justify-center items-center text-white bg-black cursor-pointer'>
                                        <Twitter size={16} />
                                    </div>
                                    <div className='w-10 h-10 transform hover:scale-105 transition-all duration-200 rounded-full flex justify-center items-center text-white bg-black cursor-pointer'>
                                        <Facebook size={16} />
                                    </div>
                                    <div className='w-10 h-10 transform hover:scale-105 transition-all duration-200 rounded-full flex justify-center items-center text-white bg-black cursor-pointer'>
                                        <Linkedin size={16} />
                                    </div>
                                    <div className='w-10 h-10 transform hover:scale-105 transition-all duration-200 rounded-full flex justify-center items-center text-white bg-black cursor-pointer'>
                                        <Instagram size={16} />
                                    </div>
                                </div>
                                <div className='flex flex-col md:flex-row text-sm gap-2 md:gap-5 text-gray-400 mt-3'>
                                    <h1 className="hover:text-gray-600 cursor-pointer">Terms and Services</h1>
                                    <h1 className="hover:text-gray-600 cursor-pointer">Privacy Policy</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThirdPart;