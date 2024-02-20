import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useMemo} from 'react';
import SimpleImageSlider from 'react-simple-image-slider';
import { SpinnerCircular } from 'spinners-react';
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [searchedProducts, setsearchedProducts] = useState("")
  const productsPerPage = 8; // Set the number of reviews to display per page

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(products.length / productsPerPage);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/products/getall?page=1&limit=12`, {
          method: 'GET',
        });
        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products)
        console.log(data.products)
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  console.log(searchedProducts)
  const search = () => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchedProducts.toLowerCase()) ||
      product.category.toLowerCase().includes(searchedProducts.toLowerCase())
    );
    setFilteredProducts(filtered); // Update filtered products
  };

  return (
    <>
  
      <div className='flex justify-center'>
        <div className='w-full'>

        <div  >
        <SimpleImageSlider
            width={'100%'}
            height={600}
            images={[
              // { url: "/ecomimage.jpg" },
              { url: "/bgimage3.jpg" },
              { url: "/bgimage1.jpg" },
              { url: "/bgimage2.jpg" },
            

              // Add more images if needed
            ]}
            showNavs={true}
            showBullets={true}
            navStyle={1}
            autoPlay={true}
          />
</div>

        </div>
      </div>

      <div className='bg-slate-50 font-serif text-4xl text-center py-8'>
        Products
      </div>
      <div className='flex justify-center mb-4 mt-1'>
        <input
          value={searchedProducts}
          onChange={(e) => setsearchedProducts(e.target.value)}
          className='p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 w-80'
          placeholder='Search the products'
          type="text"
        />
        <button
          onClick={search}
          className='ml-2 px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-screen">
        <SpinnerCircular />
      </div>
      ) : (
        <div className="p-8 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
          {filteredProducts
            .slice(
              (currentPage - 1) * productsPerPage,
              currentPage * productsPerPage
            )
            .map((product) => (
              <ProductCard key={product._id} {...product} image={product.images[0]} />
            ))}
        </div>
      )}

      <div className="flex justify-center mt-4 p-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-white border-2 border-purple-400  hover:bg-slate-200 text-white font-bold py-1 px-2 rounded mr-2"
        >
     <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{ fill: '#9e42f5' }} d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg>
          
        </button>
        <span className="p-3 mr-1">{currentPage}/{totalPages}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage * productsPerPage >= products.length}
          className="bg-white border-2 border-purple-400  hover:bg-slate-200 text-white font-bold py-1 px-2 rounded mr-2"
        >
           <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{ fill: '#9e42f5' }} d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
        </button>
      </div>
    </>
  );
}

export default ProductList;
