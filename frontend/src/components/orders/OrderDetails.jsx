import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

function OrderDetails() {
  const [orderDetails, setOrderDetails] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(`https://ecommerce-kdk6.onrender.com/api/v1/orders/getorder/${orderId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data.order);
        } else {
          console.error('Failed to fetch order details');
        }
      } catch (error) {
        console.error('Error fetching order details', error);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8 p-4 bg-white shadow-lg rounded-md">
      <h2 className="text-3xl font-bold mb-4">Order Details</h2>
      <div className="mb-4">
        <p className="font-bold">Order ID:</p>
        <p>{orderDetails._id}</p>
      </div>
      <div className="mb-4">
        <p className="font-bold">Status:</p>
        <p>{orderDetails.status}</p>
      </div>
      <div className="mb-4">
        <p className="font-bold">Total Price:</p>
        <p>₹ {orderDetails.totalPrice.toFixed(2)}</p>
      </div>
      <div className="mb-4">
        <p className="font-bold">Created At:</p>
        <p>{format(new Date(orderDetails.createdAt), 'MMMM dd, yyyy hh:mm a')}</p>
      </div>
      {orderDetails.status === 'Delivered' && (
        <div className="mb-4">
          <p className="font-bold">Delivered At:</p>
          <p>{format(new Date(orderDetails.deliveredAt), 'MMMM dd, yyyy hh:mm a')}</p>
        </div>
      )}
      <div className="mb-4">
        <p className="font-bold">Shipping Information:</p>
        <ul>
          <li><strong>Address:</strong> {orderDetails.shippingInfo.address}</li>
          <li><strong>City:</strong> {orderDetails.shippingInfo.city}</li>
          <li><strong>State:</strong> {orderDetails.shippingInfo.state}</li>
          <li><strong>Country:</strong> {orderDetails.shippingInfo.country}</li>
          <li><strong>Pin Code:</strong> {orderDetails.shippingInfo.pinCode}</li>
          <li><strong>Phone Number:</strong> {orderDetails.shippingInfo.phoneNo}</li>
        </ul>
      </div>
      <div>
        <p className="font-bold">Products:</p>
        <ul>
          {orderDetails.products.map((product) => (
            <li key={product._id} className="mb-2">
              <p><strong>Product ID:</strong> {product.product}</p>
              <p><strong>Quantity:</strong> {product.quantity}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrderDetails;
