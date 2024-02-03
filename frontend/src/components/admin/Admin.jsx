import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminProductList from './AdminProductList.jsx';
import ProductModal from './ProductModal.jsx';

const Admin = () => {
  const [openModal, setopenModal] = useState(false);
  const [productadded, setproductadded] = useState(false)
  
  const openTheModal = () => {
    setopenModal(true);
  };
 
  const newProductAdded = ()=>{
    setproductadded(previous=>!previous)
  }

  const closeModal = () => {
    setopenModal(false);
  };

  return (
    <div>
      <div className="bg-gray-300 p-4 md:flex md:justify-between md:items-center">
        <span className="text-black text-4xl font-serif italic  font- mb-4 md:mb-0 md:ml-14 pl-4">
          Hi, Admin!
        </span>
        <div className="flex items-center px-3 mr-4">
          <Link
            to="/adminorders"
            className="bg-white rounded-lg p-2 border-2 hover:bg-indigo-900 hover:border-indigo-800 hover:text-white border-black text-black mr-4 transition duration-300"
          >
            <span>Order Details</span>
          </Link>
          <button
            onClick={openTheModal}
            className="border-2 hover:bg-indigo-900 hover:border-indigo-800 hover:text-white border-black bg-white px-4 py-2 rounded-lg text-black transition duration-300"
          >
            Add a Product
          </button>
        </div>
      </div>

      {openModal && <ProductModal newProductAdded={newProductAdded} isOpen={openModal} onRequestClose={closeModal} />}
      <AdminProductList productadded={productadded} />
    </div>
  );
};

export default Admin;