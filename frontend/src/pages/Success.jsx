import React from 'react';
import { useNavigate } from 'react-router-dom';



const Success = () => {

  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center h-screen bg-green-500 text-white">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-white mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-3xl font-semibold mb-2">Payment Successful!</h1>
        <p className="text-lg">Thank you for your purchase.</p>
        <button onClick={()=>navigate('/')} className="mt-4 bg-white text-green-500 px-4 py-2 rounded-full font-semibold">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Success;
