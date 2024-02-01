import React from 'react';
import { useNavigate } from 'react-router-dom';
const Cancel = () => {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center h-screen bg-red-500 text-white">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-white mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h1 className="text-3xl font-semibold mb-2">Payment Canceled</h1>
        <p className="text-lg">Your payment has been canceled.</p>
        <button onClick={()=>navigate('/')} className="mt-4 bg-white text-red-500 px-4 py-2 rounded-full font-semibold">
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Cancel;
