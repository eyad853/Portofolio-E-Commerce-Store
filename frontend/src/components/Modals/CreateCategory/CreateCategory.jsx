import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import axios from 'axios'

const CreateCategory = ({isOpen, editingCategory, setEditingCategory, setIsOpen, categories, setCategories}) => {
    const [category, setCategory] = useState('')
    
    useEffect(() => {
        if (editingCategory) {
            setCategory(editingCategory.category);
        } else {
            setCategory('');
        }
    }, [editingCategory]);
    
    const handleAddCategory = async() => {
        try {
            const response = await axios.post('http://localhost:8000/category/add', {
                category
            })
            if (response) {
                setCategory('')
            } else {
                console.error()
            }
        } catch(error) {
            alert("Not Allowed: Real admin only")
        }
    }
    
    const updateCategory = async(categoryId) => {
        try {
            const response = await axios.put(`http://localhost:8000/category/update/${categoryId}`, {
                category
            })
            if (response) {
                const updatedCategory = response.data.udpatedCategory; // Note: matching the actual property name from backend
                setCategories(categories.map(cat =>
                    cat._id === categoryId ? updatedCategory : cat
                ))
                setEditingCategory(null);
            }
        } catch(err) {
            console.log(err);
        }
    }
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => {
                setIsOpen(false)
                setEditingCategory(null) // Reset editing state when closing modal
            }}
            className={`w-140 h-40 bg-white p-6 rounded-xl shadow-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 outline-none`}
            overlayClassName="fixed inset-0 bg-gray-500/50 z-50 flex justify-center items-center"
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
        >
            <div className='w-full h-full flex flex-col justify-between items-center'>
                <input
                    type="text"
                    value={category}
                    onChange={({target}) => {
                        setCategory(target.value)
                    }}
                    className='w-full h-12 px-5 rounded-md outline-none border border-neutral-300'
                    placeholder='Category Name'
                />
                <div
                    onClick={() => {
                        if (editingCategory) {
                            updateCategory(editingCategory._id)
                        } else {
                            handleAddCategory()
                            setCategories([...categories, {category}])
                        }
                        setIsOpen(false)
                    }}
                    className="w-40 h-10 flex cursor-pointer justify-center items-center rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300"
                >
                    {editingCategory ? "Update" : "Add Category"}
                </div>
            </div>
        </Modal>
    )
}

export default CreateCategory