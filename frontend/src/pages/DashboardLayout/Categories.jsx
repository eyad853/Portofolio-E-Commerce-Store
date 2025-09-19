import React, { useEffect, useState } from 'react'
import CreateCategory from '../../components/Modals/CreateCategory/CreateCategory'
import axios from 'axios'
import { FaPen, FaTrash } from "react-icons/fa6";

const Categories = ({ darkMode,setDashboardError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Define theme colors
  const bgPrimary = darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50';
  const bgSecondary = darkMode ? 'bg-[#2A2A2A]' : 'bg-white';
  const bgTertiary = darkMode ? 'bg-[#1E1E1E]' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-neutral-300' : 'text-gray-600';
  const borderColor = darkMode ? 'border-neutral-600' : 'border-neutral-300';
  const borderColorLight = darkMode ? 'border-neutral-700' : 'border-neutral-400';
  const hoverBg = darkMode ? 'hover:bg-[#1E1E1E]' : 'hover:bg-gray-50';

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/category/getAll`);
      if (response) {
        setCategories(response.data.allCategories);
      }
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const deleteCategory = async (categoryId) => {

      try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/category/delete/${categoryId}`);
        if (response) {
          setCategories(categories.filter(cat => cat._id !== categoryId));
        } else {
          console.error('Failed to delete category');
        }
      } catch (err) {
        setDashboardError(error.response.data.message);
        console.log(err);
        setError(true);
      }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className={`w-full h-full px-3 sm:px-6 lg:px-10 flex flex-col pb-4 sm:pb-6 pt-4 sm:pt-6 ${bgPrimary}`}>
      {/* Title and create category button */}
      <div className={`${bgSecondary} shadow-2xl rounded-md px-3 sm:px-5 h-12 sm:h-16 flex items-center justify-between`}>
        <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${textPrimary}`}>Categories</div>
        <button
          onClick={() => {
            setEditingCategory(null); // Reset editing state when creating new
            setIsOpen(true);
          }}
          className={`px-3 py-2 rounded-xl transform hover:scale-105 transition-all duration-300 ${borderColorLight} cursor-pointer border ${textPrimary} ${hoverBg} font-medium text-sm sm:text-base`}>
          <span className="hidden sm:inline">New Category</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Show all categories */}
      {loading ? (
        <div className='w-full h-full flex justify-center items-center'>
          <div className="w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 rounded-full border-y-2 border-blue-600 animate-spin"></div>
        </div>
      ) : (
        <div className={`${bgSecondary} shadow-2xl rounded-xl overflow-hidden flex-1 mt-4 sm:mt-6 lg:mt-8`}>
          {categories && categories.length > 0 ? (
            <div className='w-full h-full overflow-y-auto hide-scrollbar'>
              {/* Header for larger screens */}
              <div className={`hidden sm:flex w-full h-12 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50'} border-b ${borderColor} items-center px-4 sm:px-6 font-semibold ${textSecondary} text-sm uppercase tracking-wider`}>
                <div className="flex-1">Category Name</div>
                <div className="w-20">Actions</div>
              </div>

              {/* Categories list */}
              {categories.map((category, index) => (
                <div 
                  key={category._id}
                  className={`w-full min-h-[3rem] sm:h-12 border-b ${borderColor} flex flex-col sm:flex-row justify-between items-start sm:items-center px-3 sm:px-4 lg:px-6 py-3 sm:py-0 ${hoverBg} transition-colors duration-200`}>
                  
                  {/* Category name */}
                  <div className={`flex-1 select-none font-semibold ${textPrimary} text-sm sm:text-base mb-2 sm:mb-0`}>
                    {category.category}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setIsOpen(true);
                      }}
                      className={`p-2 sm:p-1.5 rounded-md ${hoverBg} transition-all duration-300 hover:text-blue-600 ${textSecondary}`}
                      title="Edit category"
                    >
                      <FaPen className="text-sm sm:text-base" />
                    </button>
                    
                    <button
                      onClick={() => {
                        deleteCategory(category._id);
                      }}
                      className={`p-2 sm:p-1.5 rounded-md ${hoverBg} transition-all duration-300 hover:text-red-600 ${textSecondary}`}
                      title="Delete category"
                    >
                      <FaTrash className="text-sm sm:text-base" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Show total count */}
              <div className={`${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50'} px-3 sm:px-4 lg:px-6 py-3 border-t ${borderColor}`}>
                <div className={`text-xs sm:text-sm ${textSecondary} text-center`}>
                  Total: {categories.length} categor{categories.length === 1 ? 'y' : 'ies'}
                </div>
              </div>
            </div>
          ) : (
            <div className={`w-full h-full flex flex-col justify-center items-center ${textSecondary} px-4`}>
              <div className="text-4xl sm:text-6xl mb-4 opacity-50">📂</div>
              <div className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 text-center">
                No Categories Yet
              </div>
              <div className="text-sm sm:text-base text-center mb-6">
                Create your first category to organize your products
              </div>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsOpen(true);
                }}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 transform hover:scale-105"
              >
                Create Category
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className={`mt-4 p-4 rounded-md ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'} text-center`}>
          An error occurred while loading categories. Please try again.
          <button 
            onClick={() => {
              setError(false);
              fetchCategories();
            }}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Modal */}
      <CreateCategory 
        editingCategory={editingCategory} 
        setEditingCategory={setEditingCategory} 
        categories={categories} 
        setCategories={setCategories} 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        darkMode={darkMode}
        setDashboardError={setDashboardError}
      />
    </div>
  )
}

export default Categories