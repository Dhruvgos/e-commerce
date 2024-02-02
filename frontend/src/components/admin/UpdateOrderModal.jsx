import { useState,useEffect } from "react";

export const UpdateOrderModal = ({ order, onUpdate, onClose, id }) => {
    const [newStatus, setNewStatus] = useState(order.status);
    console.log(id)
    const handleSubmit = async () => {
      try {
        // console.log(newStatus)
        const response = await fetch(`https://ecommerce-kdk6.onrender.com/api/v1/orders/update/${id}`, {
          method: 'PUT',
          credentials: 'include',
          body: JSON.stringify({ status: newStatus }),
          headers: {
            'Content-Type': 'application/json',  'auth-token':localStorage.getItem('token')
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log(data);
  
        onUpdate({
          ...order,
          status: newStatus,
        });
      } catch (error) {
        console.error('Error updating order:', error);
      }
    };
  
    return (
      <div className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Update Order</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">New Status:</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border p-2 rounded"
            >
              {newStatus === 'Pending' && (
                <>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  {/* <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option> */}
                </>
              )}
              {newStatus === 'Processing' && (
                <>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  {/* <option value="Delivered">Delivered</option> */}
                </>
              )}
              {newStatus === 'Shipped' && (
                <>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </>
              )}
              {newStatus === 'Delivered' && (
                <>
  
                  <option value="Delivered">Delivered</option>
                </>
              )}
            </select>
  
  
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Update
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };