import React, { Suspense, useEffect, useState } from 'react';
import Placeorder from './Placeorder';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Cart() {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setloading] = useState(true)
  const [reviewdelete, setReviewDelete] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/cart/get-cart', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      return data.cart;
    } catch (error) {
      console.log('first login or register.', error);
    }
  };

  useEffect(() => {
    if (!isLogin) {
      return navigate('/login');
    }
    setloading(true)
    const fetchProductDetails = async () => {
      const cartItemsData = await fetchCart();

      if (!cartItemsData || cartItemsData.length === 0) {
        setloading(false)

        return;
      }

      const productDetailsPromises = cartItemsData.map(async (item) => {
        const response = await fetch(`http://localhost:4000/api/v1/products/get/${item.productId}`, {
          method: 'GET',
        });
        const productDetails = await response.json();
        return { ...item, productDetails };
      });

      const productsWithDetails = await Promise.all(productDetailsPromises);
      setCartItemsWithDetails(productsWithDetails);
      setloading(false)

    };

    fetchProductDetails();
    // setloading(false)
    setReviewDelete(false);

    if (orderPlaced) {
      setOrderPlaced(false); // Reset the state after fetching
    }
  }, [orderPlaced, reviewdelete]); // Add orderPlaced as a dependency here

  const deleteItem = async (id) => {
    const response = await fetch(`http://localhost:4000/api/v1/cart/remove-from-cart/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await response.json();
    setReviewDelete(true);
    console.log(data);
  };

  return (


    <div className="container mx-auto p-4 mt-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        {loading?(<p>Loading...</p>):
        (cartItemsWithDetails.length === 0) ? (

            
          <p>Your cart is empty.</p>
        


        ) : (
          <div>
            {cartItemsWithDetails.map((item) => (
              <div key={item.productId} className="mb-4 border-b border-gray-300 pb-4 flex items-center">
                <div className="flex-grow pr-4">
                  <p className="text-gray-600 mb-2">{`Product: ${item.productDetails.product.name}`}</p>
                  <p className="text-gray-600 mb-2">{`Price: ₹${item.productDetails.product.price}`}</p>
                  <p className="text-gray-600 mb-2">{`Quantity: ${item.quantity}`}</p>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="border-2 border-red-600 hover:bg-slate-200  text-white font-bold py-1 px-3 rounded"
                  >

                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{ fill: 'red' }} d="M360-640v-80h240v80H360ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z" /></svg>
                  </button>
                </div>
                <div className="flex-shrink">
                  {item.productDetails.product.images.length > 0 && (
                    <img
                      className="w-20 h-20 object-cover"
                      src={item.productDetails.product.images[0].secure_url}
                      alt={item.productDetails.product.name}
                    />
                  )}
                </div>
              </div>
            ))}

            <div className="mt-4">
              <button
                onClick={() => setModalIsOpen(true)}
                className="bg-white hover:bg-blue-700 border-2 border-blue-700 hover:text-white text-blue-700 font-bold py-2 px-4 rounded"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {modalIsOpen && (
          <Placeorder
            products={cartItemsWithDetails.map((item) => ({
              product: item.productId,
              quantity: item.quantity,
            }))}
            isOpen={modalIsOpen}
            onRequestClose={() => {
              setModalIsOpen(false);
              setOrderPlaced(true);
            }}
          />
        )}
      </div>
    </div>
  );

}

export default Cart;
