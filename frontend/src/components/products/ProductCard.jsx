import React from 'react';
import { Link, json } from 'react-router-dom';
import QuantityModal from './QuantityModal.jsx';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import mongoose from 'mongoose';
const ProductCard = ({ _id, name, price, image ,rating}) => {
// console.log(_id,name,price)
  const dispatch = useDispatch()
  // console.log(rating)
  const user = useSelector((state)=>state.user.userProfile)
  // console.log(user.userProfile._id)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate()
  const handleAddToCart = async (quantity) => {
    try {

          if(!user){
            console.log("first login")
            return navigate('/login')
          }
 
      const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/cart/add-to-cart`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',  'auth-token':localStorage.getItem('token')
        },
        body: JSON.stringify({ userId: user.userProfile._id, productId:_id, quantity: quantity }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
  
      const data = await response.json();
      console.log(`Product ID: ${_id}, Quantity: ${quantity}`);
      setModalIsOpen(false); // Close the modal after adding to cart
    } catch (error) {
      console.error('Error adding item to cart:', error.message);
      // Handle the error, you can show a message to the user or log it
    }
  };
  

  return (
    <div className="max-w-md mx-auto hover:bg-slate-100 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        {/* {console.log(image.secure_url)} */}
        <div className="md:flex-shrink-0">
        {image && <img  className="h-48 w-full object-cover md:w-48" src={image.secure_url} alt={name} />}

        </div>
        <div className="p-5">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{name}</div>
          <p className="mt-2 text-gray-500">{`₹${price.toFixed(2)}`}</p>
          <Link to={`/product/${_id}`} className="mt-2 text-blue-500 hover:underline">
            View Details
          </Link>
          

          <div className="flex items-center mt-1">
  {rating !== 0
    ? Array.from({ length: rating }, (_, index) => (
        <span key={index} className="text-yellow-500">
          {"★"}
        </span>
      ))
    : (
        <span key={0} className="text-yellow-500">
          {"★"}
        </span>
      )}
</div>

          <div className="mt-4  ">
          <button onClick={() => setModalIsOpen(true)} className="  border-2  border-indigo-600 hover:bg-slate-300 text-white font-bold py-2 px-4 rounded">
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
    <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"
      style={{ fill: 'blue' }}
    />
  </svg>
</button>

          </div>
         
          {modalIsOpen && (
            <QuantityModal productDetail={ {_id, name, price, image }}
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              onAddToCart={handleAddToCart}
            />
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
