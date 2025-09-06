import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeftLong, FaAngleDown, FaXmark, FaCheck } from "react-icons/fa6";
import { CiImageOn } from "react-icons/ci";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import axios from "axios";
import { Link } from 'react-router-dom';

const D_Products = ({ loadingProducts, darkMode, currencySymbol }) => {
  const [showProducts, setShowProducts] = useState(true);
  const [isCategoryListOpen, setIsCategoryListOpen] = useState(false);
  const [isQualityListOpen, setIsQualityListOpen] = useState(false);
  const categoryRef = useRef(null);
  const qualityRef = useRef(null);
  
  // Track whether we're creating a new product or updating an existing one
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Form data
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('category');
  const [quality, setQuality] = useState('quality');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [isInRecomendationPart, setIsInRecomendationPart] = useState(false);

  // Images
  const [mainImage, setMainImage] = useState(null);
  const [extraImages, setExtraImages] = useState([null, null, null]);
  const [previewMainImage, setPreviewMainImage] = useState('');
  const [previewExtraImages, setPreviewExtraImages] = useState(['', '', '']);
  
  // Keep track of existing image paths for updates
  const [existingMainImage, setExistingMainImage] = useState('');
  const [existingExtraImages, setExistingExtraImages] = useState(['', '', '']);

  // Validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);

  // Define theme colors
  const bgPrimary = darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50';
  const bgSecondary = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';
  const bgTertiary = darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-300';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-neutral-300' : 'text-gray-600';
  const borderColor = darkMode ? 'border-neutral-600' : 'border-neutral-300';
  const borderColorLight = darkMode ? 'border-neutral-700' : 'border-neutral-400';
  const hoverBg = darkMode ? 'hover:bg-[#1E1E1E]' : 'hover:bg-neutral-100';
  const inputBg = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickCategoryOutSide = (e) => {
      if (categoryRef && categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryListOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickCategoryOutSide);
    return () => {
      document.removeEventListener('mousedown', handleClickCategoryOutSide);
    }
  }, []);

  useEffect(() => {
    const handleClickQualityOutSide = (e) => {
      if (qualityRef && qualityRef.current && !qualityRef.current.contains(e.target)) {
        setIsQualityListOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickQualityOutSide);
    return () => {
      document.removeEventListener('mousedown', handleClickQualityOutSide);
    }
  }, []);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/category/getAll`);
      if (response) {
        setCategories(response.data.allCategories);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle image uploads
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewMainImage(reader.result);
      };
      reader.readAsDataURL(file);
      // Clear main image error if it exists
      if (errors.mainImage) {
        setErrors(prev => ({ ...prev, mainImage: null }));
      }
    }
  };

  const handleExtraImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newExtraImages = [...extraImages];
      newExtraImages[index] = file;
      setExtraImages(newExtraImages);

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previewExtraImages];
        newPreviews[index] = reader.result;
        setPreviewExtraImages(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!productName.trim()) newErrors.productName = "Product name is required";
    if (!productDescription.trim()) newErrors.productDescription = "Product description is required";
    if (category === "category" || !category) newErrors.category = "Please select a category";
    if (quality === "quality") newErrors.quality = "Please select a quality";
    if (!price) newErrors.price = "Price is required";
    else if (isNaN(parseFloat(price))) newErrors.price = "Price must be a number";
    if (quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";
    
    // Only require main image for new products, not for updates
    if (!isUpdating && !mainImage) newErrors.mainImage = "Main product image is required";

    return newErrors;
  };

  // Handle form submit (used for both create and update)
  const handleSubmit = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      
      // Create form data for submission
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', productDescription);
      formData.append('category', category);
      formData.append('quality', quality);
      formData.append('price', price);
      formData.append('quantity', quantity);
      formData.append('inRecomendations', isInRecomendationPart);
      
      // Only append mainImage if a new one was selected
      if (mainImage) {
        formData.append('mainImage', mainImage);
      }
      
      // Add extra images if they exist
      extraImages.forEach((img, index) => {
        if (img) formData.append(`extraImage${index + 1}`, img);
      });

      try {
        let response;
        if (isUpdating) {
          // Update existing product
          response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/product/update/${currentProductId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          });
          setSuccessMessage('Product updated successfully!');
        } else {
          // Create new product
          response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/product/create`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          });
          setSuccessMessage('Product created successfully!');
        }
        
        if (response.status === 201 || response.status === 200) {
          // Reset form after successful submission
          setFormSuccess(true);
          resetForm();
          setTimeout(() => {
            setFormSuccess(false);
            setShowProducts(true); // Go back to products list
          }, 500);
        }
      } catch (error) {
        console.error("Error with product:", error);
        alert("Not Allowed: Real admin only")
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setProductName('');
    setProductDescription('');
    setCategory(null);
    setCategoryName('category');
    setQuality('quality');
    setPrice('');
    setQuantity(0);
    setMainImage(null);
    setExtraImages([null, null, null]);
    setPreviewMainImage('');
    setPreviewExtraImages(['', '', '']);
    setExistingMainImage('');
    setExistingExtraImages(['', '', '']);
    setErrors({});
    setIsUpdating(false);
    setCurrentProductId(null);
  };

  // Handle discard
  const handleDiscard = () => {
    if (window.confirm(`Are you sure you want to discard this ${isUpdating ? 'update' : 'product'}?`)) {
      resetForm();
      setShowProducts(true);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/getAll`);
      if (response.data.success) {
        setProducts(response.data.products);
        setProductsCount(response.data.count);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllProducts();
  }, [showProducts]);

  // Handle update button click
  const handleUpdateClick = async (product) => {
    try {
      // Set form fields with product data
      setProductName(product.name);
      setProductDescription(product.description);
      setCategory(product.category._id);
      setCategoryName(product.category.category);
      setQuality(product.quality);
      setPrice(product.price);
      setQuantity(product.quantity);
      setIsInRecomendationPart(product.inRecomendations);
      
      // Set existing image paths
      if (product.mainImage) {
        setExistingMainImage(product.mainImage);
        setPreviewMainImage(`${import.meta.env.VITE_BACKEND_URL}${product.mainImage}`);
      }
      
      // Handle extra images if they exist
      const newExistingExtraImages = ['', '', ''];
      const newPreviewExtraImages = ['', '', ''];
      
      if (product.extraImages && product.extraImages.length > 0) {
        product.extraImages.forEach((img, index) => {
          if (index < 3) {
            newExistingExtraImages[index] = img;
            newPreviewExtraImages[index] = `${import.meta.env.VITE_BACKEND_URL}${img}`;
          }
        });
      }
      
      setExistingExtraImages(newExistingExtraImages);
      setPreviewExtraImages(newPreviewExtraImages);
      
      // Set update mode
      setIsUpdating(true);
      setCurrentProductId(product._id);
      
      // Show the form
      setShowProducts(false);
    } catch (error) {
      console.error("Error fetching product for update:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/product/delete/${productId}`);
      if (response) {
        setProducts(products.filter(product => product._id !== productId));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={`w-full h-full px-3 sm:px-6 pt-3 sm:pt-6 ${bgPrimary}`}>
      {showProducts ? loadingProducts ? (
        <div className='w-full h-full flex justify-center items-center'>
          <div className="w-60 h-60 sm:w-80 sm:h-80 rounded-full border-y-2 border-blue-600 animate-spin"></div>
        </div>
      ) : (
        <div className='w-full h-full overflow-auto hide-scrollbar'>
          {/* Products list view */}
          <div className={`h-12 sm:h-16 px-3 sm:px-6 ${bgSecondary} ${borderColor} border-b rounded-md shadow flex items-center justify-between`}>
            <div className={`text-xl sm:text-3xl font-bold ${textPrimary}`}>All Products</div>
            <div 
              onClick={() => {
                resetForm(); // Ensure form is reset when adding a new product
                setShowProducts(false);
              }}
              className={`w-32 sm:w-40 h-8 sm:h-10 rounded-md flex justify-center items-center ${bgSecondary} border ${borderColorLight} transform hover:scale-105 transition-all duration-300 font-semibold cursor-pointer ${textPrimary}`}>
              <span className="hidden sm:inline">Add New Product</span>
              <span className="sm:hidden">Add Product</span>
            </div>
          </div>

          <div className={`flex-1 p-3 sm:p-7 ${bgSecondary} overflow-auto hide-scrollbar border ${borderColor} shadow-2xl rounded-2xl mt-3 sm:mt-7`}>
            {products.length > 0 ? (
              <div className="w-full h-full gap-3 sm:gap-6 lg:gap-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[20rem] sm:auto-rows-[24rem]">
                {products.map(product => (
                  <div key={product._id} className={`border relative cursor-pointer pb-1.5 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 ${borderColor} ${bgSecondary}`}>
                    {/* img */}
                    <Link to={`/product/${product._id}`} className='absolute inset-0 z-0'></Link>
                    <div className={`w-full h-3/5 rounded-t-xl flex justify-center items-center ${bgTertiary}`}>
                      <div className="w-full h-full flex justify-center items-center">
                        <div className="w-66 h-46 flex justify-center items-center">
                          <img 
                            src={`${import.meta.env.VITE_BACKEND_URL}${product.mainImage}`} 
                            className="h-full w-full object-contain"
                            alt={product.name}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="h-2/5 px-2 py-1">
                      {/* name */}
                      <div className={`text-lg sm:text-2xl font-bold line-clamp-1 ${textPrimary}`}>{product.name}</div>

                      {/* category and price */}
                      <div className={`flex mt-2 font-semibold justify-between items-center ${textSecondary}`}>
                        {/* category */}
                        <div className="font-bold text-xs sm:text-sm truncate max-w-[120px]">Category: {product.category.category}</div>
                        {/* price */}
                        <div className={`text-lg sm:text-xl ${textPrimary}`}>{currencySymbol}{product.price}</div>
                      </div>

                      {/* quantity and quality */}
                      <div className={`flex justify-between items-center mt-1 ${textSecondary}`}>
                        {/* quality */}
                        <div className="font-semibold text-xs sm:text-sm truncate max-w-[100px]">Quality: {product.quality}</div>
                        {/* quantity */}
                        <div className="font-semibold text-xs sm:text-sm">Qty: {product.quantity}</div>
                      </div>

                      <div className="flex justify-center gap-2 sm:gap-8 items-center m-2">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateClick(product);
                          }}
                          className="w-1/2 h-6 sm:h-8 z-20 mt-2.5 font-semibold rounded-md cursor-pointer flex justify-center items-center bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 text-xs sm:text-sm">
                          Update
                        </div>
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product._id);
                          }}
                          className="w-1/2 h-6 sm:h-8 z-20 mt-2.5 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold flex justify-center items-center transition-colors duration-200 text-xs sm:text-sm">
                          Delete
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`w-full h-full flex justify-center items-center text-lg sm:text-xl font-bold ${textPrimary}`}>No Products Yet</div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full">
          {/* Product create/update view */}
          <div className={`h-12 sm:h-16 ${borderColorLight} border-b border-t flex items-center gap-3`}>
            <div 
              onClick={() => setShowProducts(true)} 
              className={`w-6 h-6 mt-0.5 ${bgSecondary} cursor-pointer rounded-md flex justify-center items-center border ${borderColor} ${textPrimary}`}>
              <FaArrowLeftLong/>
            </div>
            <div className={`text-xl sm:text-3xl font-bold ${textPrimary}`}>{isUpdating ? 'Update Product' : 'New Product'}</div>
          </div>

          {/* Product creation/update form */}
          <div className="flex flex-col lg:flex-row pb-6 sm:pb-10 gap-3 sm:gap-5 h-auto mt-3 sm:mt-6">
            {/* First box - Product details */}
            <div className={`w-full lg:w-1/2 h-full ${bgSecondary} border ${borderColor} rounded-md p-3 sm:p-6`}>
              <div className={`border ${borderColor} p-3 sm:p-5 rounded-md`}>
                {/* Product name */}
                <div className={`mb-2 font-semibold ${textPrimary}`}>Product Name</div>
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className={`w-full h-8 sm:h-10 outline-none rounded-md px-2.5 border mb-1 ${inputBg} ${textPrimary} ${errors.productName ? 'border-red-500' : borderColor}`} 
                  placeholder='Product Name' 
                />
                {errors.productName && <p className="text-red-500 text-xs mb-2">{errors.productName}</p>}

                {/* Description */}
                <div className={`mb-2 font-semibold ${textPrimary}`}>Product Description</div>
                <textarea 
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className={`w-full min-h-32 sm:min-h-40 overflow-auto hide-scrollbar outline-none p-2 rounded-md max-h-32 sm:max-h-40 border ${inputBg} ${textPrimary} ${errors.productDescription ? 'border-red-500' : borderColor}`}
                  placeholder="Product Description"
                ></textarea>
                {errors.productDescription && <p className="text-red-500 text-xs">{errors.productDescription}</p>}
              </div>

              {/* Product category */}
              <div className={`mt-8 sm:mt-14 mb-2 font-semibold ${textPrimary}`}>
                Category
              </div>
              <div className={`p-3 sm:p-5 w-full h-auto border rounded-md ${borderColor}`}>
                <div 
                  onClick={() => setIsCategoryListOpen(prev => !prev)}
                  className={`relative h-8 sm:h-10 w-full border rounded-md px-3 flex cursor-pointer items-center justify-between ${inputBg} ${textPrimary} ${errors.category ? 'border-red-500' : borderColor}`}>
                  <div className="">{categoryName}</div>
                  <div className=""><FaAngleDown/></div>
                  {isCategoryListOpen && (
                    <div 
                      ref={categoryRef}
                      className={`absolute w-full h-40 sm:h-60 border -bottom-40 sm:-bottom-58 ${borderColor} shadow-2xl rounded-md left-0 ${bgSecondary} z-10 overflow-y-scroll hide-scrollbar`}>
                      {categories && categories.length > 0 ? (
                        <div className="w-full h-full">
                          {categories.map((categoryItem, index) => (
                            <div 
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCategory(categoryItem._id);
                                setCategoryName(categoryItem.category);
                                setIsCategoryListOpen(false);
                                // Clear category error if it exists
                                if (errors.category) {
                                  setErrors(prev => ({ ...prev, category: null }));
                                }
                              }}
                              className={`h-10 sm:h-12 flex ${hoverBg} transition-all duration-300 justify-center items-center border-b ${borderColor} cursor-pointer ${textPrimary}`}>
                              {categoryItem.category}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`flex justify-center items-center w-full h-full ${textPrimary}`}>
                          No Categories Yet
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              {/* Product quality */}
              <div className={`mt-5 mb-2 font-semibold ${textPrimary}`}>
                Quality
              </div>
              <div className={`p-3 sm:p-5 w-full h-auto border rounded-md ${borderColor}`}>
                <div 
                  onClick={() => setIsQualityListOpen(prev => !prev)}
                  className={`relative h-8 sm:h-10 w-full border rounded-md px-3 flex cursor-pointer items-center justify-between ${inputBg} ${textPrimary} ${errors.quality ? 'border-red-500' : borderColor}`}>
                  <div className="">{quality}</div>
                  <div className=""><FaAngleDown/></div>
                  {isQualityListOpen && (
                    <div 
                      ref={qualityRef}
                      className={`absolute w-full h-auto max-h-40 sm:max-h-60 border ${borderColor} shadow-2xl rounded-md left-0 top-full mt-1 ${bgSecondary} z-10 overflow-y-auto hide-scrollbar`}>
                      {["New", "Like New", "Refurbished", "Used - Good", "Used - Acceptable", "Damaged"].map((qualityOption, index) => (
                        <div 
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuality(qualityOption);
                            setIsQualityListOpen(false);
                            // Clear quality error if it exists
                            if (errors.quality) {
                              setErrors(prev => ({ ...prev, quality: null }));
                            }
                          }}
                          className={`flex justify-center items-center py-2 sm:py-3 border-b ${borderColor} ${hoverBg} transition-all duration-300 cursor-pointer ${textPrimary}`}>
                          {qualityOption}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.quality && <p className="text-red-500 text-xs mt-1">{errors.quality}</p>}
              </div>
            </div>

            {/* Second box - Product images and pricing */}
            <div className={`w-full lg:w-1/2 h-full ${bgSecondary} border ${borderColor} rounded-md p-3 sm:p-6`}>
              <div className={`font-semibold ${textPrimary}`}>Product Images</div>
              {/* Main image upload */}
              <div className={`h-auto flex flex-col gap-3 sm:gap-5 p-3 sm:p-5 border ${borderColor} mt-2 rounded-md`}>
                <div 
                  className={`h-32 sm:h-48 cursor-pointer border border-dashed relative ${borderColor} flex justify-center items-center rounded-md overflow-hidden ${errors.mainImage ? 'border-red-500' : ''}`}>
                  {previewMainImage ? (
                    <img src={previewMainImage} alt="Main product" className="h-full w-full object-contain" />
                  ) : (
                    <div className={`flex flex-col justify-center items-center ${textSecondary}`}>
                      <div className="text-2xl sm:text-3xl"><CiImageOn/></div>
                      <div className="font-bold text-center text-xs sm:text-sm">Main Product Image {isUpdating ? '(Optional for update)' : '(Required)'}</div>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className='absolute inset-0 opacity-0 z-50' 
                  />
                </div>
                {errors.mainImage && <p className="text-red-500 text-xs">{errors.mainImage}</p>}
                
                {/* Extra image uploads */}
                <div className="h-16 sm:h-24 flex gap-2.5">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className={`w-1/3 cursor-pointer h-full border border-dashed relative ${borderColor} flex justify-center items-center rounded-md overflow-hidden`}>
                      {previewExtraImages[index] ? (
                        <img src={previewExtraImages[index]} alt={`Extra product ${index + 1}`} className="h-full w-full object-contain" />
                      ) : (
                        <div className={`flex flex-col justify-center items-center ${textSecondary}`}>
                          <div className="text-sm sm:text-base"><CiImageOn/></div>
                          <div className="text-xs flex font-semibold text-center">Extra {index + 1}</div>
                          <div className="text-xs">(Optional)</div>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleExtraImageChange(index, e)}
                        className='absolute inset-0 opacity-0 z-50' 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className={`flex mt-5 gap-3 sm:gap-5 items-center select-none ${textPrimary}`}>
                <div className="font-semibold">Price:</div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={price} 
                    onChange={(e) => {
                      setPrice(e.target.value);
                      // Clear price error if it exists
                      if (errors.price) {
                        setErrors(prev => ({ ...prev, price: null }));
                      }
                    }} 
                    className={`w-24 sm:w-32 px-2 border h-8 sm:h-10 rounded-md outline-none ${inputBg} ${textPrimary} ${errors.price ? 'border-red-500' : borderColor}`} 
                    placeholder={`00.00 ${currencySymbol}`}
                  />
                  {errors.price && <p className="text-red-500 text-xs absolute">{errors.price}</p>}
                </div>
              </div>

              {/* Quantity */}
              <div className={`flex mt-6 sm:mt-8 gap-3 sm:gap-5 items-center ${textPrimary}`}>
                <div className="font-semibold select-none">Quantity:</div>
                <div className="flex items-center gap-2 sm:gap-3.5">
                  <div 
                    onClick={() => {
                      if (quantity > 0) {
                        setQuantity(prev => prev - 1);
                      }
                    }}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md flex justify-center items-center border ${borderColor} cursor-pointer ${hoverBg}`}>
                    <FaAngleLeft/>
                  </div>
                  <div className="select-none w-8 sm:w-10 text-center">{quantity}</div>
                  <div 
                    onClick={() => {
                      setQuantity(prev => prev + 1);
                      // Clear quantity error if it exists
                      if (errors.quantity) {
                        setErrors(prev => ({ ...prev, quantity: null }));
                      }
                    }}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md flex justify-center items-center border ${borderColor} cursor-pointer ${hoverBg}`}>
                    <FaAngleRight/>
                  </div>
                </div>
                {errors.quantity && <p className="text-red-500 text-xs ml-2">{errors.quantity}</p>}
              </div>

              {/* Recommendation Toggle */}
              <div className={`flex flex-col sm:flex-row sm:items-center gap-2 mt-5 ${textPrimary}`}>
                <div className="font-semibold">Put in the recommendation part:</div>
                <div className={`w-24 sm:w-32 h-6 sm:h-8 rounded-full flex items-center relative border ${borderColorLight}`}>
                  <div 
                    onClick={() => setIsInRecomendationPart(prev => !prev)}
                    className={`
                      h-full w-6 sm:w-8 rounded-full flex justify-center items-center text-white absolute transform transition-transform duration-300 cursor-pointer
                      ${isInRecomendationPart ? "translate-x-[72px] sm:translate-x-[96px] bg-green-500" : "translate-x-0 bg-red-600"}
                    `}
                  >
                    {isInRecomendationPart ? <FaCheck className="text-xs sm:text-sm" /> : <FaXmark className="text-xs sm:text-sm" />}
                  </div>
                </div>
              </div>

              {/* Submit & discard buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-10 h-auto sm:h-12 mt-6 sm:mt-5">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`h-10 sm:h-full select-none rounded-md w-full sm:w-40 text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 border flex justify-center items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'transform hover:scale-105 cursor-pointer'}`}>
                  {isSubmitting ? (isUpdating ? 'Updating...' : 'Adding...') : (isUpdating ? 'Update Product' : 'Add Product')}
                </button>
                <button
                  onClick={handleDiscard}
                  disabled={isSubmitting}
                  className={`h-10 sm:h-full select-none transform hover:scale-105 cursor-pointer rounded-md w-full sm:w-40 ${borderColor} text-white bg-red-600 hover:bg-red-700 transition-all duration-300 border flex justify-center items-center`}>
                  Discard
                </button>
              </div>

              {/* Success message */}
              {formSuccess && (
                <div className={`mt-4 ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'} p-3 rounded-md text-center`}>
                  {successMessage}
                </div>
              )}
              
              {/* General error message */}
              {errors.submit && (
                <div className={`mt-4 ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'} p-3 rounded-md text-center`}>
                  {errors.submit}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default D_Products;