import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductReview from "./ProductReview";
import { useSelector } from "react-redux";
import SimpleImageSlider from "react-simple-image-slider";
import QuantityModal from "./QuantityModal";

const ProductDetails = () => {
  // const user = useSelector((state)=>state.user.userProfile)
  const { productId } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [productDetails, setProductDetails] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imagesToDisplay, setimagesToDisplay] = useState([])
  const [reviewedByUser, setReviewedByUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setimages] = useState([])
  const reviewsPerPage = 2; // Set the number of reviews to display per page
  // const images = [
  //   {
  //     url: "https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     url: "https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     url: "https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     url: "https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     url: "https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  // ];
  useEffect(() => {
    
    
    const fetchAProduct = async () => {
      const response = await fetch(
        `https://ecommerce-kdk6.onrender.com/v1/products/get/${productId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      console.log(data.product.images)
      const imagesArray = data.product.images.map((i) => ({
        url: i.secure_url,
      }));
      setimages(imagesArray); // Set the state with the array of images
      // console.log(images)
      setimagesToDisplay(imagesArray); // Optionally set another state if needed
      setProductDetails(data.product);
    };

    const fetchReviews = async () => {
      const response = await fetch(
        `https://ecommerce-kdk6.onrender.com/api/v1/products/productreview/${productId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setReviews(data.productReview);
      data.productReview.forEach((r) => {
        if (r.user === user.userProfile._id) {
          setReviewedByUser(true);
        }
      });
    };

  
    console.log(images)
    fetchAProduct();
    // DisplayImage()
    fetchReviews();

  }, [productId, reviewedByUser, user.userProfile._id]);

  const onRequestClose = () => {
    setIsOpen(false);
  };

  const deleteReview = async () => {
    const response = await fetch(
      `https://ecommerce-kdk6.onrender.com/api/v1/products/productreview/${productId}`,
      {
        method: "DELETE",
        credentials: "include",headers:{
          'auth-token':localStorage.getItem('token')
        }
      }
    );

    const data = await response.json();
    setReviewedByUser(false);
    console.log(data);
  };

  if (!productDetails) {
    return <div>Loading...</div>; // Handle loading state
  }

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  console.log(images)
  const handleAddToCart = async (quantity) => {
    try {

      if (!user) {
        console.log("first login")
        return navigate('/login')
      }

      const response = await fetch('https://ecommerce-kdk6.onrender.com/api/v1/cart/add-to-cart', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',  'auth-token':localStorage.getItem('token')
        },
        body: JSON.stringify({ userId: user.userProfile._id, productId: productId, quantity: quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      console.log(`Product ID: ${productId}, Quantity: ${quantity}`);
      setModalIsOpen(false); // Close the modal after adding to cart
    } catch (error) {
      console.error('Error adding item to cart:', error.message);
      // Handle the error, you can show a message to the user or log it
    }
  };
  return (
    <div className="container mx-auto p-4 mt-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md flex flex-col md:flex-row">
        <div className="md:w-1/2 mr-4">
          <SimpleImageSlider
            autoPlay={true}
            width={400}
            height={400}
            images={images}
            showBullets={true}
            showNavs={true}
          />
        </div>
        <div className="md:w-1/2">
          {console.log(productDetails)}
          <h2 className="text-2xl font-bold mb-2">{productDetails.name}</h2>
          <p className="text-lg  font-sans  font-medium text-black mb-2">{`₹${productDetails.price.toFixed(2)}`}</p>
          <p className="text-gray-600 mb-4">{`Category: ${productDetails.category}`}</p>
          <p className="text-gray-600 mb-4">{`Stock: ${productDetails.stock}`}</p>
          <p className="text-gray-600 mb-4">{`Number of Reviews: ${productDetails.numOfReviews}`}</p>
          <p className="text-gray-500 mb-4">Description : {productDetails.description}</p>
          <button onClick={() => setModalIsOpen(true)} className="border-2  border-indigo-600 hover:bg-slate-300 text-white font-bold py-2 px-4 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
              <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"
                style={{ fill: 'blue' }}
              />
            </svg>
          </button>
          {modalIsOpen && (
            <QuantityModal productDetail={{ _id: productDetails._id, name: productDetails.name, price: productDetails.price, image: productDetails.images[0] }}
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              onAddToCart={handleAddToCart}
            />
          )}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Reviews</h3>
            {!reviewedByUser ? (
              <button
                onClick={() => setIsOpen(true)}
                className="border-2 border-white hover:bg-yellow-500 bg-yellow-400  text-white font-bold py-2 px-4   rounded-lg mt-1"
              >

                Write a review
              </button>
            ) : (
              <button
                onClick={deleteReview}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-1"
              >
                Delete Review
              </button>
            )}
            {isOpen && (
              <ProductReview
                id={productId}
                isOpen={isOpen}
                onRequestClose={onRequestClose}
              />
            )}
            {reviews.length > 0 ? (
              <div>
                <ul className="divide-y divide-gray-300">
                  {reviews
                    .slice(
                      (currentPage - 1) * reviewsPerPage,
                      currentPage * reviewsPerPage
                    )
                    .map((review) => (
                      <li key={review._id} className="mb-4">
                        <div className="flex items-center mb-2">
                          <p className="text-gray-600 font-bold mt-4">{review.name}</p>
                          <div className="flex items-center space-x-2 ml-4 mt-4">
                            {Array.from({ length: review.rating }, (_, index) => (
                              <span key={index} className="text-yellow-500">{"★"}</span>
                            ))}
                            <span className="text-gray-600">{review.rating}/5</span>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </li>
                    ))}
                </ul>
                <div className="mt-4">
                  <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-white border-2 border-purple-400  hover:bg-slate-200 text-white font-bold py-1 px-2 rounded mr-2"
                  >

                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{ fill: '#9e42f5' }} d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg>
                  </button>
                  <span className="p-3  mr-2  pb-0 mb-2">{currentPage}/{totalPages}</span>
                  <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage * reviewsPerPage >= reviews.length}
                    className="bg-white border-2 border-purple-400  hover:bg-slate-200 text-white font-bold py-1 px-2 rounded"
                  >


                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{ fill: '#9e42f5' }} d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
                  </button>
                </div>
              </div>
            ) : (
              <p>No reviews available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
