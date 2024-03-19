import React from "react";
import { IoIosClose } from "react-icons/io";

const ProductDetails = ({ product, setModelDetails,handleAddToCart }) => {

    const API_URL = process.env.REACT_APP_API_URL;
  return (
    <div className="">
      <div class="bg-gray-100 dark:bg-gray-800 py-8 relative">
        <div
          className="md:right-10 absolute cursor-pointer top-0 right-0"
          onClick={() => setModelDetails(null)}
        >
          <IoIosClose size={40} />
        </div>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row -mx-4">
            <div class="md:flex-1 px-4">
              <div class="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">

                          {product.image && product.image.startsWith("https://") ? (
            <img class="w-full h-full object-cover" src={product.image} alt={product.productName} />
          ) : (
            <img class="w-full h-full object-cover"
              src={`${API_URL}/${product.image.replace(/\\/g, "/")}`}
              alt={product.productName}
            />
          )}
              </div>
              <div class="flex -mx-2 mb-4">
                <div class="w-full px-2">
                  <button onClick={()=>handleAddToCart(product._id)} class="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            <div class="md:flex-1 px-4">
              <h2 class="text-2xl flex justify-center mb-8 font-bold text-gray-800 dark:text-white">
                {product.productName}
              </h2>

              <div class="flex mb-4 justify-around">
                <div class="mr-4 ">
                  <span class="font-bold text-gray-700 dark:text-gray-300">
                    Price:
                  </span>
                  <span class="text-gray-600 dark:text-gray-300 ml-1">
                    ₹{product.price}
                  </span>
                </div>
                <div>
                  <span class="font-bold text-gray-700 dark:text-gray-300">
                    Availability:
                  </span>
                  <span class=" bg-green-500 rounded-full ml-2 px-3 mt-2"></span>
                </div>
              </div>
              <div class="mb-4 flex gap-2 justify-center">
                <span class="font-bold text-gray-700 dark:text-gray-300">
                  Days:
                </span>
                <div class="flex items-center">{product.days}</div>
              </div>
              <div class="mb-4 flex justify-around">
                <div>
                  <span class="font-bold  text-gray-700 dark:text-gray-300">
                    Address:
                  </span>
                  <div class="flex items-center mt-2">
                    {product.city}, {product.state}, {product.pincode}
                  </div>
                </div>
                <div></div>
              </div>
              <div className="mb-4 -ml-6 flex justify-center">
                <div>
                  <span class="font-bold text-gray-700 dark:text-gray-300">
                    Rack Description
                  </span>
                </div>
              </div>
              <div class="mb-4 flex justify-around">
                <div>
                  <p class="text-gray-600 flex items-center dark:text-gray-300 text-sm mt-2">
                    {product.details}
                  </p>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
