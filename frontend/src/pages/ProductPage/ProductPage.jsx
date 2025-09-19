import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Nav from '../../components/Nav/Nav'
import ReviewModal from '../../components/Modals/ReviewModal/ReviewModal'
import { FaUser } from 'react-icons/fa'
import AddToCartMessage from '../../components/AddToCartMessage/AddToCartMessage'

const ProductPage = ({socket, user, setProducts, updateProductReview, isReviewModalOpen, setIsReviewModalOpen, darkMode ,handleAddToCart}) => {
    const [product, setProduct] = useState({})
    const [showingImage, setShowingImage] = useState('')
    const [purchaseQuantity, setPurchaseQuantity] = useState(1) // eslint-disable-line no-unused-vars
    const [expandedDescription, setExpandedDescription] = useState(false)
    const [shouldShowToggle, setShouldShowToggle] = useState(false)
    const [initialRatingForModal, setInitialRatingForModal] = useState(0); // New state to hold rating for modal
    const [hoveredRating, setHoveredRating] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const descriptionRef = useRef(null)

    const [showMessage , setShowMessage]=useState(false)
    
        const handleShow = ()=>{
            setShowMessage(true)
            setTimeout(()=>{
                setShowMessage(false)
            },3000)
        }

        
    const handleNewReview = (data) => {
            setProduct(prev => ({
                ...prev,
                reviews: data.reviews
            }));
    };

    const { id } = useParams()

    useEffect(() => {
    if (!socket) return;

    socket.on('newReview', handleNewReview);

    return () => {
        socket.off('newReview', handleNewReview); // clean up on unmount
    };
}, [socket, id]);


    useEffect(() => {
        if (descriptionRef.current) {
            const el = descriptionRef.current;
            const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
            const height = el.scrollHeight;
            const lines = height / lineHeight;

            if (lines > 10) {
                setShouldShowToggle(true);
            }
        }
    }, [product.description]);

    const handleFetchProduct = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/getProductById/${id}`)

            if (response) {
                setProduct(response.data.product)
                // When product is fetched, find if the current user has reviewed it
                const currentUserReview = response.data.product.reviews.find(
                    (review) => review?.user?.toString() === user?._id
                );
                if (currentUserReview) {
                    setInitialRatingForModal(currentUserReview.review);
                } else {
                    setInitialRatingForModal(0); // No existing review
                }
                console.log('product has been fetched correctly');
            } else {
                setError('Failed to fetch product')
            }
        } catch (error) {
            console.log(error);
            setError('Error fetching product')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleFetchProduct()
    }, [id, user]) // Added user to dependency array to re-fetch if user changes

    useEffect(() => {
        if (product.mainImage) {
            setShowingImage(product.mainImage)
        }
    }, [product.mainImage])

    // MODIFIED: This now opens the modal and sets the initial rating
    const handleStarClickOnPage = (rating) => {
        setInitialRatingForModal(rating);
        setIsReviewModalOpen(true);
    }

    const calculateAverageRating = () => {
        if (!product.reviews || product.reviews.length === 0) return 0
        const total = product.reviews.reduce((sum, review) => sum + review.review, 0)
        return (total / product.reviews.length).toFixed(1)
    }

    const StarIcon = ({ filled, className, ...props }) => (
        <svg
            className={className}
            {...props}
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="20"
            height="20"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
        </svg>
    )

    const UserIcon = ({ className }) => (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
    )

    const ArrowLeftIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    )

    // Keep renderStars mostly the same, but onClick calls handleStarClickOnPage
    const renderStars = (rating, interactive = false, onHover = null, onClick = null) => {
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1
            const filled = starValue <= (interactive ? (hoveredRating || rating) : rating) // Use the passed rating for display
            return (
                <StarIcon
                    key={index}
                    filled={filled}
                    className={`cursor-pointer transition-colors duration-200 ${
                        filled ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    onMouseEnter={() => interactive && onHover && onHover(starValue)}
                    onMouseLeave={() => interactive && onHover && onHover(0)}
                    onClick={() => interactive && onClick && onClick(starValue)} // This will be handleStarClickOnPage
                />
            )
        })
    }

    if (loading) {
        return (
            <div className={`w-screen min-h-screen flex items-center justify-center ${darkMode ? "bg-[#1A1A1A]" : "bg-neutral-50"}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Loading product...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={`w-screen min-h-screen flex items-center justify-center ${darkMode ? "bg-[#1A1A1A]" : "bg-neutral-50"}`}>
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={handleFetchProduct}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    // Determine the user's existing review rating for display on the page
    const currentUserReview = product.reviews?.find(
        (review) => review?.user?.toString() === user?._id
    );
    const displayUserRating = currentUserReview ? currentUserReview.review : 0;


    return (
        <div className={`w-screen h-screen overflow-auto  flex flex-col pt-16 select-none overflow-x-hidden ${darkMode ? "bg-[#1A1A1A] text-[#EAEAEA]" : "bg-gray-50"}`}>

            <Nav user={user} darkMode={darkMode} />

            {/* Back Button */}
            <div className='px-6 py-4'>
                <button
                    onClick={() => window.history.back()}
                    className={`flex cursor-pointer items-center hover:text-gray-800 transition-colors ${darkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-600"}`}
                >
                    <ArrowLeftIcon className='mr-2' />
                    Back to Products
                </button>
            </div>

            <div className='flex-1 flex flex-col lg:flex-row gap-8 px-6 pb-8'>

                {/* SECTION 1: Main Image */}
                <div className='lg:w-1/2 flex flex-col'>
                    <div className={`rounded-lg shadow-lg p-6 mb-6 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"}`}>
                        <div className={`aspect-square w-full rounded-lg overflow-hidden mb-4 ${darkMode ? "bg-[#3A3A3A]" : "bg-gray-100"}`}>
                            {showingImage && (
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}${showingImage}`}
                                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                                    alt={product.name}
                                />
                            )}
                        </div>

                        {/* Additional Images */}
                        {product.extraImages && product.extraImages.length > 0 && (
                            <div className='grid grid-cols-4 gap-3'>
                                <div
                                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                                        darkMode ? "bg-[#3A3A3A]" : "bg-gray-100"
                                    } ${
                                        showingImage === product.mainImage ? 'border-blue-500' : 'border-transparent'
                                    } hover:border-blue-300 transition-colors`}
                                    onClick={() => setShowingImage(product.mainImage)}
                                >
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}${product.mainImage}`}
                                        alt={product.name}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                {product.extraImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                                            darkMode ? "bg-[#3A3A3A]" : "bg-gray-100"
                                        } ${
                                            showingImage === image ? 'border-blue-500' : 'border-transparent'
                                        } hover:border-blue-300 transition-colors`}
                                        onClick={() => setShowingImage(image)}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}${image}`}
                                            alt={`${product.name} view ${index + 1}`}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* SECTION 2: Product Details */}
                <div className='lg:w-1/2 flex flex-col'>
                    <div className={`rounded-lg shadow-lg p-6 mb-6 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"}`}>
                        {/* Product Title */}
                        <h1 className={`text-3xl font-bold mb-4 ${darkMode ? "text-[#EAEAEA]" : "text-gray-800"}`}>{product.name}</h1>

                        {/* Quality Badge */}
                        <div className='mb-4'>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                product.quality === 'New' ? 'bg-green-100 text-green-800' :
                                product.quality === 'Like New' ? 'bg-blue-100 text-blue-800' :
                                product.quality === 'Refurbished' ? 'bg-yellow-100 text-yellow-800' :
                                `${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"}`
                            }`}>
                                {product.quality}
                            </span>
                        </div>

                        {/* Average Rating Display */}
                        <div className='flex items-center mb-4'>
                            <div className='flex mr-2'>
                                {renderStars(calculateAverageRating())}
                            </div>
                            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {calculateAverageRating()} ({product.reviews?.length || 0} reviews)
                            </span>
                        </div>

                        {/* User Rating Section - MODIFIED */}
                        <div className={`mb-6 p-4 rounded-lg ${darkMode ? "bg-[#3A3A3A]" : "bg-gray-50"}`}>
                            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-[#EAEAEA]" : ""}`}>Rate this product:</h3>
                            <div className='flex items-center'>
                                {renderStars(
                                    displayUserRating, // Show existing user rating if available
                                    true,
                                    setHoveredRating,
                                    handleStarClickOnPage // Use the new function here
                                )}
                                {displayUserRating > 0 && ( // Display based on actual user review
                                    <span className={`ml-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                        You rated: {displayUserRating} star{displayUserRating > 1 ? 's' : ''}
                                    </span>
                                )}
                                {displayUserRating === 0 && hoveredRating > 0 && ( // Display hover state if no existing rating
                                    <span className={`ml-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                        Click to rate: {hoveredRating} star{hoveredRating > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className='mb-6'>
                            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-[#EAEAEA]" : ""}`}>Description</h3>
                            <div
                                ref={descriptionRef}
                                className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"} ${
                                    !expandedDescription && shouldShowToggle ? 'line-clamp-10' : ''
                                }`}
                            >
                                {product.description}
                            </div>
                            {shouldShowToggle && (
                                <button
                                    onClick={() => setExpandedDescription(!expandedDescription)}
                                    className='text-blue-600 hover:text-blue-800 font-medium mt-2'
                                >
                                    {expandedDescription ? 'Show Less' : 'Read More'}
                                </button>
                            )}
                        </div>

                        {/* Price */}
                        <div className='mb-6'>
                            <span className='text-3xl font-bold text-green-600'>
                                ${product.price?.toFixed(2)}
                            </span>
                        </div>

                        {/* Stock Status */}
                        <div className='mb-6'>
                            <span className={`text-sm font-medium ${
                                product.inStock ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {product.inStock ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={() => {
                                handleAddToCart()
                                handleShow()}}
                            disabled={!product.inStock}
                            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                                product.inStock
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
                        >
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>

                    {/* SECTION 3: Reviews */}
                    <div className={`rounded-lg shadow-lg p-6 ${darkMode ? "bg-[#2A2A2A]" : "bg-white"}`}>
                        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-[#EAEAEA]" : "text-gray-800"}`}>Customer Reviews</h2>

                        {product.reviews && product.reviews.length > 0 ? (
                            <div className='space-y-4'>
                                {product.reviews.map((review, index) => (
                                    <div key={index} className={`pb-4 last:border-b-0 ${darkMode ? "border-[#3A3A3A]" : "border-b border-gray-200"}`}>
                                        <div className='flex items-start'>
                                            <div className='flex-shrink-0 mr-4'>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
                                                    {review.user&&review.user.avatar?(
                                                        <div className='w-full h-full rounded-full'>
                                                            <img src={review.user?.avatar} className='w-full h-full object-cover rounded-full'  />
                                                        </div>
                                                    ):(
                                                        <FaUser />
                                                    )}
                                                </div>
                                            </div>
                                            <div className='flex-1'>
                                                <div className='flex items-center mb-2'>
                                                    <div className='flex mr-2'>
                                                        {renderStars(review?.review)}
                                                    </div>
                                                    <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                        {new Date(review?.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                    User: {review?.user?.username}
                                                </p>
                                                {review.comment && ( // Changed from review.message to review.comment
                                                    <p className={`mt-2 ${darkMode ? "text-[#EAEAEA]" : "text-gray-700"}`}>
                                                        {review?.comment}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='text-center py-8'>
                                <StarIcon filled={false} className={`mx-auto text-4xl mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>No reviews yet. Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .line-clamp-10 {
                    display: -webkit-box;
                    -webkit-line-clamp: 10;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
            <ReviewModal
                isOpen={isReviewModalOpen}
                onRequestClose={() => setIsReviewModalOpen(false)}
                darkMode={darkMode}
                productId={product._id} // Pass the product ID
                initialRating={initialRatingForModal} // Pass the initial rating
                updateProductReview={updateProductReview} // Keep passing this
                // You'll also need to pass the current review's comment if exists to pre-fill
                initialComment={currentUserReview?.comment || ''} // Pass existing comment
            />
            {showMessage?<AddToCartMessage />:null}
        </div>
    )
}

export default ProductPage;