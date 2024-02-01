import React, { useEffect, useState } from 'react';
import { UpdateOrderModal } from './UpdateOrderModal.jsx';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setloading] = useState(true)
  useEffect(() => {
    const fetchAdminOrders = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/orders/getallorders`, {
          credentials: 'include'
        });

        const data = await response.json();
        setOrders(data.orders);
        setloading(false)
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchAdminOrders();
  }, [updateModalOpen]); // Include updateModalOpen in the dependency array

  const handleUpdateOrder = (orderId) => {
    setUpdateModalOpen(true);
    const selected = orders.find((order) => order._id === orderId);
    setSelectedOrder(selected);
  };

  const handleDeleteOrder = async (orderId) => {
    const response = await fetch(`https://ecommerce-kdk6.onrender.com/api/v1/orders/delete/${orderId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();
    console.log(data);

    // Remove the deleted order from the state
    setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
  };

  const handleToggleDetails = (orderId) => {
    setExpandedOrder((prevOrder) => (prevOrder === orderId ? null : orderId));
  };

  const handleUpdateOrderModal = (updatedOrder) => {
    // Update the order in the state or re-fetch orders based on your logic
    console.log('Updated order:', updatedOrder);
    // Close the modal
    setUpdateModalOpen(false);

    // Update the order in the state
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
    );
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4">Admin Orders</h1>
      <div className="grid grid-cols-1 gap-4">
        {loading?<p>Loading...</p>:orders.length===0?<p>No orders to show.</p>:
        orders.map((order) => (
          <div key={order._id} className="border p-4 rounded shadow mb-4 flex justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Order #{order._id}</h2>
              <p>Total Price: ₹ {order.totalPrice}</p>
              <p >Status: {( order.status==='Delivered')? <span className='text-green-500'>{order.status}</span>:order.status}</p>
              <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
              {expandedOrder === order._id && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
                  <p>{order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state}, {order.shippingInfo.country} - {order.shippingInfo.pinCode}</p>
                  <p>Phone: {order.shippingInfo.phoneNo}</p>
                </div>
              )}
              {expandedOrder === order._id && (
                <div className="mt-4">
                  <h3 className="  text-lg font-semibold mb-2">Products</h3>
                  {order.products.map((product) => (
                    <div key={product._id} className="mb-2">
                      <p>{product.quantity} x Product #{product._id}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 flex-shrink-1">
              <button
                onClick={() => handleToggleDetails(order._id)}
                className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
              >
                {expandedOrder === order._id ? 

<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{fill:'white'}} d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg> : 
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{fill:'white'}} d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>}
              </button>
              {order.status !='Delivered'&&<button
                onClick={() => handleUpdateOrder(order._id)}
                className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
              >
                
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path  style={{fill:'white'}} d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-94h80v240H600v-80h110q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q105 0 183.5-68T756-440h82q-15 137-117.5 228.5T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"/></svg>
              </button>}
              <button
                onClick={() => handleDeleteOrder(order._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{fill:'white'}} d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* {console.log(selectedOrder._id)} */}
      {updateModalOpen && (
        <UpdateOrderModal
          order={selectedOrder}
          onUpdate={handleUpdateOrderModal}
          onClose={() => setUpdateModalOpen(false)}
          id={selectedOrder._id}
        />
      )}
    </div>
  );
};

export default AdminOrders;
