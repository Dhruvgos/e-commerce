import React, { useState } from 'react';

const QuantityModal = ({ isOpen, onRequestClose, onAddToCart, productDetail }) => {
  const [productQuantity, setProductQuantity] = useState(1);

  const handleAddToCart = () => {
    const productDetails = {
      name: productDetail.name,
      price: parseFloat(productDetail.price),
      quantity: parseInt(productQuantity),
      id: productDetail._id,
    };
    onAddToCart(productDetails.quantity);
    onRequestClose();
  };

  return (
    <div className={`fixed inset-0 overflow-y-auto ${isOpen ? 'visible' : 'hidden'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <h1 className="text-3xl font-bold  text-center pt-2 "> Product Details</h1>
          <div className="bg-white px-6 flex flex-col-reverse sm:flex-row">
            <div className="sm:w-1/2 p-8">
              <label htmlFor="productName" className="block mb-2 text-sm font-medium text-gray-900">
                Product Name : {`${productDetail.name}`}
              </label>
              <label htmlFor="productPrice" className="block mb-2 text-sm font-medium text-gray-900">
                Product Price : {`${productDetail.price}`}
              </label>
              <label htmlFor="productId" className="block mb-2 text-sm font-medium text-gray-900">
                Product ID : {`${productDetail._id}`}
              </label>
              <label htmlFor="productQuantity" className="block mb-2 text-sm font-medium text-gray-900">
                Product Quantity
              </label>
              <input
                type="number"
                id="productQuantity"
                name="productQuantity"
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter product quantity"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
                required
              />

              <div className="flex justify-between">
                <button onClick={onRequestClose} className="bg-white border-2 hover:bg-slate-200 border-purple-600 px-4 py-2 rounded-md text-black mr-2">
                  
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{fill:'#6a28bf'}}  d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </button>
                <button onClick={handleAddToCart} className="bg-white border-2 hover:bg-slate-200 border-purple-600 px-4 py-2 rounded-md text-white">
       
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{fill:'#6a28bf'}} d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z"/></svg>
                </button>
              </div>
            </div>
            <div className="sm:w-1/2 p-8">
              {productDetail.image && <img className="w-full h-40 object-cover mb-4" src={productDetail.image.secure_url} alt={productDetail.name} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;
