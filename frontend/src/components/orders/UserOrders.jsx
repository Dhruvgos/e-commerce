import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useState,useEffect } from 'react';
import Cookies from 'js-cookie';
function UserOrders() {
  const [loading, setloading] = useState(true)
  const [orders, setorders] = useState([])

  useEffect(() => {
    const fetchOrder = async () => {
      try {

       

        
        const response = await fetch('https://ecommerce-kdk6.onrender.com/api/v1/orders/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json','auth-token':localStorage.getItem('token')
    
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.order);
          setorders(data.order);
          if(orders.length ==0 ){
            
            setloading(false)
          }
          setloading(false)
        } else {
          console.error('Failed to fetch user orders');
        }
      } catch (error) {
        console.error('Error fetching user orders', error);
      }
    };

    fetchOrder();
  }, []);
    


  
  return (
    <div>
        <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-4">My Orders</h2>
      <ul className="space-y-4">
      {(loading)?<p>Loading...</p>:
        orders.length===0? <p>No Orders to show.</p>:
        orders.map((order) => (
          <li
            key={order._id}
            className="border p-4 rounded-md shadow-md hover:shadow-lg transition duration-300"
          >
            
            <p className="text-lg font-bold">Order ID: {order._id}</p>
            <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p >Status: {( order.status==='Delivered')? <span className='text-green-500'>{order.status}</span>:order.status}</p>
            <p className="text-gray-600">totalPrice:{` ₹ ${order.totalPrice.toFixed(2)}`}</p> 
            <p className="text-gray-600">Order placed At: {format(new Date(order.createdAt), 'MMMM dd, yyyy hh:mm a')}</p>
            {order.status === 'Delivered' && (
              <p className="text-gray-600">Delivered At: {format(new Date(order.deliveredAt), 'MMMM dd, yyyy hh:mm a')}</p>
            )}
            <Link
              to={`/myorders/${order._id}`}
              className="text-blue-500 hover:underline transition duration-300"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </div>
  )
}

export default UserOrders
