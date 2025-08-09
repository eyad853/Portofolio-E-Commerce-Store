import React, { useState } from 'react'
import Sidebar from '../../../components/Sidebar/Sidebar'
import ProductsPart from '../../../components/ProductsPart/ProductsPart'

const SecondPart = ({currencySymbol,darkMode,handleShow,products, setProducts,updateProductReview ,handleAddToCart}) => {
  const [searchCategory, setSearchCategory]=useState('all')
  return (
    <div className='min-h-screen flex flex-col lg:flex-row'>
        <Sidebar  
          darkMode={darkMode}
          searchCategory={searchCategory} 
          setSearchCategory={setSearchCategory}/>
        <ProductsPart 
          darkMode={darkMode}
          updateProductReview={updateProductReview} 
          searchCategory={searchCategory} 
          handleAddToCart={handleAddToCart} 
          products={products} 
          setProducts={setProducts}
          currencySymbol={currencySymbol}
          handleShow={handleShow}
        />
    </div>
  )
}

export default SecondPart