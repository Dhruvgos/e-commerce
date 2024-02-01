import React, { useState } from 'react';
// import { UseSelector } from 'react-redux';
function ProductReview({id, isOpen,onRequestClose }) {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  // const user = useSelector((state)=>state.user.userProfile)
  // console.log(user)
  
console.log(id)
  const handleRatingChange = (e) => {
    // Ensure rating is between 1 and 5
    const newRating = Math.min(5, Math.max(1, parseInt(e.target.value, 10)));
    setRating(newRating);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`https://ecommerce-kdk6.onrender.com/api/v1/products/create-review/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: rating, comment: comment }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
  
      // Perform actions with rating and comment
      onRequestClose();
    } catch (error) {
      console.error('Error:', error.message);
      // Handle and display the error
    }
  };
  
  return (
    <div className={`fixed inset-0 overflow-y-auto ${isOpen ? 'visible' : 'hidden'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white p-8">
            <h1 className="text-3xl font-bold mb-4">Product Review</h1>

            <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900">Rating: {rating}</label>
            <input
              type="range"
              id="rating"
              name="rating"
              min="1"
              max="5"
              value={rating}
              onChange={handleRatingChange}
              className="w-full mb-4"
            />

            <label htmlFor="comment" className="block mb-2 text-sm font-medium text-gray-900">Comment</label>
            <textarea
              id="comment"
              name="comment"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your comment"
              value={comment}
              onChange={handleCommentChange}
              required
            />

            <div className="flex justify-between">
              <button onClick={onRequestClose} className="bg-gray-200  hover:bg-slate-300 px-4 py-2 rounded-md text-black mr-2">Cancel</button>
              <button onClick={handleSubmit} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-white">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductReview;
