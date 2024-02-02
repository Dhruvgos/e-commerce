import React from 'react'
import { useEffect,useState } from 'react'
// import ProductCard from '../products/ProductCard.jsx'
import AdminProductCard from './AdminProductCard.jsx'



const AdminProductList = () => {

    const [loading, setloading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            const repsonse = await fetch("https://ecommerce-kdk6.onrender.com/api/v1/products/getadminproducts", {
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
    }, [])

    const [products, setproducts] = useState([])
    // console.log(products[0].images[0].secure_url)
    return (
        <div className="p-8 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {loading?<p>Loading...</p>:products.length===0?<p>No products to show.</p>:
            products.map((product) => (
                console.log(product),
                <AdminProductCard key={product._id} product={product} {...product} image={product.images[0].secure_url} />
                ))}
                {/* <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Add a new product</button> */}
        </div>)

}

export default AdminProductList
