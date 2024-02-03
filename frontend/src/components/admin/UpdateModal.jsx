import React, { useState } from 'react';

const UpdateModal = ({ isOpen, onRequestClose, productDetail,productisUpdated }) => {
    const [productQuantity, setProductQuantity] = useState(productDetail.product.stock);
    //   console.log(productDetail.product._id)
    const [productName, setproductName] = useState(productDetail.name)
    const [price, setPrice] = useState(productDetail.price)
    const [category, setCategory] = useState(productDetail.product.category)
    const [description, setDescription] = useState(productDetail.product.description)
    const UpdateProduct = async() => {
       const reponse = await fetch(`https://ecommerce-kdk6.onrender.com/api/v1/products/${productDetail._id}/update`,{
        method:'PUT',credentials:'include',
            headers: {
                'Content-Type': 'application/json',  'auth-token':localStorage.getItem('token')
            },
        
        body:JSON.stringify({
            name: productName,price:price,stock:productQuantity,category:category,description:description
        })

       })
       const data = await reponse.json();
       onRequestClose()
       productisUpdated()
       console.log(data)
    };
// console.log( productName,price,productQuantity,category,description)
    return (
        <div className={`fixed inset-0 overflow-y-auto ${isOpen ? 'visible' : 'hidden'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white p-8">
                        <h1 className="text-3xl font-bold mb-4">Enter Product Details</h1>
                        <label htmlFor="productId" className="block mb-2 text-sm font-medium text-gray-900">
                            Product ID: {`${productDetail._id}`}
                        </label>
                        <label htmlFor="productName" className="block mb-2 text-sm font-medium text-gray-900">
                            Product Name:
                        </label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            placeholder="Enter product name"
                            value={productName}
                            onChange={(e) => setproductName(e.target.value)}
                            required
                        />

                        <label htmlFor="productPrice" className="block mb-2 text-sm font-medium text-gray-900">
                            Product Price:
                        </label>
                        <input
                            type="number"
                            id="productPrice"
                            name="productPrice"
                            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            placeholder="Enter product name"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">
                            Product category:
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
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                            Product description:
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
                            <button onClick={onRequestClose} className="bg-gray-300 px-4 py-2 rounded-md text-black mr-2">
                                Cancel
                            </button>
                            <button onClick={UpdateProduct} className="bg-green-600 px-4 py-2 rounded-md text-white">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
