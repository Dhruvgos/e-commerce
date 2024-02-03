import React, { useState } from 'react';
import {loadStripe} from '@stripe/stripe-js';
function Placeorder({products, isOpen, onRequestClose }) {
    const [shippingInfo, setShippingInfo] = useState({
        address: '',
        city: '',
        state: '',
        country: '',
        pinCode: 123456,
        phoneNo: 1234567890,
    });
console.log(products)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo((prevShippingInfo) => ({
            ...prevShippingInfo,
            [name]: value,
        }));
    };

    const handleSaveShippingInfo = async () => {
        try {

          const stripe = await loadStripe(import.meta.env.VITE_STRIPE_LOADKEY);
          console.log('Shipping Info:', shippingInfo);
          console.log(products);
      
          const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/orders/place-order`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json','auth-token':localStorage.getItem('token')
            },
            body: JSON.stringify({ shippingInfo, products }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log(data);
          const result = stripe.redirectToCheckout({sessionId:data.id})
          if(result.error){
            console.log(result.error)
          }

          // Close the modal after saving shipping info
          onRequestClose()
        } catch (error) {
          console.error('Error:', error.message);
        }
      };
      

    return (
        <div className={`fixed inset-0 overflow-y-auto ${isOpen ? 'visible' : 'hidden'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white p-8">
                        <h1 className="text-3xl font-bold mb-4">Enter Shipping Information</h1>

                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Address</label>
                        <input type="text" id="address" name="address" className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500" placeholder="Enter address" value={shippingInfo.address} onChange={handleChange} required />

                        <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900">City</label>
                        <input type="text" id="city" name="city" className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500" placeholder="Enter city" value={shippingInfo.city} onChange={handleChange} required />
                        <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900">State</label>
                        <input type="text" id="state" name="state" className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500" placeholder="Enter state" value={shippingInfo.state} onChange={handleChange} required />
                        <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-900">Country</label>
                        <input type="text" id="country" name="country" className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500" placeholder="Enter country" value={shippingInfo.country} onChange={handleChange} required />
                        <label htmlFor="pinCode" className="block mb-2 text-sm font-medium text-gray-900">PinCode</label>
                        <input type="number" id="pinCode" name="pinCode" className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500" placeholder="Enter pinCode" value={shippingInfo.pinCode} onChange={handleChange} required />
                        <label htmlFor="phoneNo" className="block mb-2 text-sm font-medium text-gray-900">Contact</label>
                        <input type='number' id="phoneNo" name="phoneNo" className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500" placeholder="Enter phoneNo" value={shippingInfo.phoneNo} onChange={handleChange} required />
                       

                        <div className="flex justify-between">
                            <button onClick={onRequestClose} className="bg-gray-300 px-4 py-2 rounded-md text-black mr-2">Cancel</button>
                            <button onClick={handleSaveShippingInfo} className="bg-green-600 px-4 py-2 rounded-md text-white">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Placeorder;
