import React, { useEffect, useState } from 'react'
import FirstPart from './FirstPart/FIrstPart'
import SecondPart from './SecondPart/SecondPart'
import ThirdPart from './ThirdPart/ThirdPart'
import BuyModal from '../../components/buyModal/BuyModal'
import axios from 'axios'
import ReviewModal from '../../components/Modals/ReviewModal/ReviewModal'
import AddToCartMessage from '../../components/AddToCartMessage/AddToCartMessage'
import AuthModal from '../../components/Modals/AuthModal/AuthModal'

const MainPage = ({
    currencySymbol,
    storeName,
    storeLogo,
    darkMode,
    user,
    handleAddToCart ,
    updateProductReview ,
    products,
    setProducts ,
    isReviewModalOpen,
    setIsReviewModalOpen,
    setShowAuthModal,
    pendingProduct,
    showAuthModal,
    setDarkMode
}) => {
    const [showMessage , setShowMessage]=useState(false)

    const handleShow = ()=>{
        setShowMessage(true)
        setTimeout(()=>{
            setShowMessage(false)
        },3000)
    }
    
    return (
    <div  className={`w-screen h-screen overflow-auto hide-scrollbar`}>
        <FirstPart  
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        user={user}
        storeName={storeName}
        storeLogo={storeLogo}
        />
        <SecondPart  
        darkMode={darkMode} 
        updateProductReview={updateProductReview} 
        products={products} setProducts={setProducts} 
        handleAddToCart={handleAddToCart}
        currencySymbol={currencySymbol}
        handleShow={handleShow}
        />
        <ThirdPart  
        darkMode={darkMode} 
        products={products} 
        setProducts={setProducts} 
        handleAddToCart={handleAddToCart}
        currencySymbol={currencySymbol}
        handleShow={handleShow}
        />
        {showMessage?<AddToCartMessage />:null}
        <AuthModal 
        showModal={showAuthModal}
        setShowModal={setShowAuthModal}
        pendingProduct={pendingProduct}
        />
    </div>
)
}

export default MainPage