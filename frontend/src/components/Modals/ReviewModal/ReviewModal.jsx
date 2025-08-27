import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const StarIcon = ({handleFetchProduct, filled, className, ...props }) => (
    <svg
        className={className}
        {...props}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        width="24" // Slightly larger for the modal
        height="24" // Slightly larger for the modal
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
    </svg>
);

const ReviewModal = ({ isOpen, onRequestClose, updateProductReview, productId, initialRating, initialComment, darkMode }) => {
    const [rating, setRating] = useState(initialRating);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState(initialComment); // Renamed from message to comment

    // Update internal state when initialRating or initialComment props change
    useEffect(() => {
        setRating(initialRating);
        setComment(initialComment);
    }, [initialRating, initialComment, isOpen]); // Added isOpen to re-sync when modal opens

    const handleStarClick = (starValue) => {
        setRating(starValue);
    };

    const handleSubmit = async () => {
        // Call the updateProductReview from props, passing productId, rating, and comment
        onRequestClose();
        await updateProductReview(productId, rating, comment);
        // Reset state after submission and close, ready for next review
        
        setRating(0);
        setComment('');
        setHoveredRating(0);
    };

    const handleClose = () => {
        onRequestClose();
        // Reset state when closing the modal without submitting
        setRating(0);
        setComment('');
        setHoveredRating(0);
    }

    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            const filled = starValue <= (hoveredRating || rating);
            return (
                <StarIcon
                    key={index}
                    filled={filled}
                    className={`cursor-pointer transition-colors duration-200 ${
                        filled ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => handleStarClick(starValue)}
                />
            );
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose} // Use handleClose here
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            contentLabel="Submit Review"
            className="fixed inset-0 flex items-center justify-center p-4"
            overlayClassName="fixed inset-0 bg-gray-500/50 z-50 flex justify-center items-center"
        >
            <div className={`rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative ${darkMode ? "bg-[#2A2A2A] text-[#EAEAEA]" : "bg-white text-gray-800"}`}>
                <h2 className="text-2xl font-bold mb-4">Submit Your Review</h2>

                <div className="mb-6">
                    <label className={`block text-sm font-bold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Your Rating:
                    </label>
                    <div className="flex items-center space-x-1">
                        {renderStars()}
                    </div>
                    {rating > 0 && (
                        <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            You are rating: {rating} star{rating > 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <label htmlFor="review-comment" className={`block text-sm font-bold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Your Comment (optional):
                    </label>
                    <textarea
                        id="review-comment" // Changed ID for consistency
                        className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline resize-y min-h-[100px] ${darkMode ? "bg-[#3A3A3A] text-[#EAEAEA] border-gray-600" : "text-gray-700 border-gray-300"}`}
                        placeholder="Share your thoughts on this product..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className={`font-bold py-2 px-4 rounded transition-colors ${darkMode ? "bg-gray-600 hover:bg-gray-700 text-gray-100" : "bg-gray-300 hover:bg-gray-400 text-gray-800"}`}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={rating === 0} // Disable submit if no rating is selected
                    >
                        Submit Review
                    </button>
                </div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className={`absolute top-3 right-3 ${darkMode ? "text-gray-400 hover:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </Modal>
    );
};

export default ReviewModal;