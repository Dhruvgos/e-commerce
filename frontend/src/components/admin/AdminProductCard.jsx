import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UpdateModal from './UpdateModal';

const AdminProductCard = ({ _id, name, price, image, rating, product,productisUpdated ,productisDeleted}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const deleteProduct = async()=>{
    const repsonse = await fetch(`${import.meta.env.VITE_URL}/api/v1/products/${_id}/delete`,{
      method:'DELETE',credentials:'include',
      headers:{
        'auth-token':localStorage.getItem('token')
      }
    })
    if(repsonse.status==200){
      productisDeleted()
        console.log(repsonse)
    }
    // const data = await repsonse.json();
    // console.log(data)
  }


  return (
    <div className=" max-w-sm min-w-96 mx-auto bg-white rounded-md shadow-md">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          {image && <img className="h-48 w-full object-cover md:w-48" src={image} alt={name} />}
        </div>
        <div className="pr-6 py-3">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{name}</div>
          <p className="mt-2 text-gray-700">{`₹${price.toFixed(2)}`}</p>
          <div className="flex items-center mt-1">
            {rating !== 0 ? (
              Array.from({ length: rating }, (_, index) => (
                <span key={index} className="text-yellow-500">
                  {"★"}
                </span>
              ))
            ) : (
              <span key={0} className="text-yellow-500">
                {"★"}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col items-center">
            <Link to={`/product/${_id}`} className="text-blue-500 hover:underline mt-2">
              View Details
            </Link>
<div className='flex'>

            <button onClick={() => setModalIsOpen(true)} className="bg-blue-500 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
              
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{fill:'white'}} d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
            </button>
            <button onClick={deleteProduct} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
             
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{fill:'white'}} d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
</div>
          </div>

          {modalIsOpen && (
            <UpdateModal
              productDetail={{ _id, name, price, image, product }}
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              productisUpdated={productisUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
