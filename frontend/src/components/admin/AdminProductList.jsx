import React from 'react'
import { useEffect,useState } from 'react'
// import ProductCard from '../products/ProductCard.jsx'
import AdminProductCard from './AdminProductCard.jsx'

import { SpinnerCircular } from 'spinners-react';

const AdminProductList = ({productadded}) => {
    const [productUpdated, setproductUpdated] = useState(false)
    const [loading, setloading] = useState(true)
    const [productdeleted, setproductdeleted] = useState(false)

    const productisDeleted = () =>{
        setproductdeleted(prev=>!prev)
    }

    const productisUpdated =() =>{
        setproductUpdated(updated=>!updated)
    }
    useEffect(() => {
        const fetchProducts = async () => {
            const repsonse = await fetch(`${import.meta.env.VITE_URL}/api/v1/products/getadminproducts`, {
                method: 'GET',credentials:'include',headers:{
                    'auth-token':localStorage.getItem('token')
                }
            })
            const data = await repsonse.json();
            console.log(data)
            const allProducts = data.product
            setproducts(allProducts)
            setloading(false)
        }
        fetchProducts()
    }, [productUpdated,productadded,productdeleted])

    const [products, setproducts] = useState([])
    // console.log(products[0].images[0].secure_url)
    return (
        
        <div className="p-8 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {loading?<div className=" col-span-3  flex items-center justify-center h-screen">
<SpinnerCircular />
</div>:products.length===0?<p>No products to show.</p>:
            products.map((product) => (
                console.log(product),
                <AdminProductCard productisDeleted={productisDeleted} productisUpdated={productisUpdated} key={product._id} product={product} {...product} image={product.images[0].secure_url} />
                ))}
                {/* <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Add a new product</button> */}
        </div>)

}

export default AdminProductList
