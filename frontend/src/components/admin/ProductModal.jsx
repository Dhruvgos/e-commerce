import React, { useState } from 'react';
import { Cloudinary } from "@cloudinary/url-gen";

const ProductModal = ({ isOpen, onRequestClose }) => {
  const [productQuantity, setProductQuantity] = useState(0);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imageInfo, setImageInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const formData = new FormData();
  

  const handleImageUpload = async () => {
    try {
      setLoading(true);
      formData.append('upload_preset', "pj0ylhze");

      for (const image of images) {
        formData.append('file', image);
      }

      const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`;
      const response = await fetch(cloudinaryUploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const uploadImg = { secure_url: data.secure_url, public_id: data.public_id };
        setImageInfo(prevImages => [...prevImages, uploadImg]);
      } else {
        console.error('Error uploading images:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const AddProduct = async () => {
    try {
      await handleImageUpload();
      const imagesArray = Array.from(images).map(image => image.url || image.public_id);

      const response = await fetch('https://ecommerce-kdk6.onrender.com/api/v1/products/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',  'auth-token':localStorage.getItem('token')
        },
        body: JSON.stringify({
          name: productName,
          price: price,
          stock: productQuantity,
          category: category,
          description: description,
          images: imageInfo,
        }),
      });

      const data = await response.json();
      console.log(data);

      formData.delete('images');
      setImages([]);
      onRequestClose();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className={`fixed inset-0 overflow-y-auto ${isOpen ? 'visible' : 'hidden'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white p-8">
            <h1 className="text-3xl font-bold mb-4">Enter Product Details</h1>

            <label htmlFor="productName" className="block text-sm font-medium text-gray-900 mb-2">
              Product Name:
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />

            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-900 mb-2">
              Product Price:
            </label>
            <input
              type="number"
              id="productPrice"
              name="productPrice"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter product price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
              Product Category:
            </label>
            <input
              type="text"
              id="category"
              name="category"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter product category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
              Product Description:
            </label>
            <input
              type="text"
              id="description"
              name="description"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label htmlFor="productQuantity" className="block text-sm font-medium text-gray-900 mb-2">
              Product Quantity:
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

            <div className="flex justify-between items-center">
              <div className='flex-1 w-auto'>
                <input type="file" name='images' accept="image/*" multiple onChange={(event) => setImages(event.target.files)} />
                <button className='bg-blue-100  text-white px-4 py-2 rounded-md mt-2' onClick={handleImageUpload}>
                 
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{fill:'#3131e8'}} d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                </button>
                {loading ? 'Uploading...' : ''}
                <div className="flex  justify-between mt-2">
                <button onClick={onRequestClose} className="bg-gray-300 px-4 py-2 rounded-md text-black mr-2">
                  Cancel
                </button>
                <button onClick={AddProduct} className= " border-2 border-green-600 bg-green-300  text-green-800 px-4 py-2 rounded-md mr-3 ">
                  Add Product
                </button>
              </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
