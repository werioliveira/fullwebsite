"use client";
import CartContext from "@/context/CartContext";
import Link from "next/link";
import { useContext } from "react";
import { Toaster, toast } from "sonner";

// Write a fetcher function to wrap the native fetch function and return the result of a call to the URL in JSON format
function Products({ product }) {
  const { addItemToCart, addItemToWishList } = useContext(CartContext);
  const addToCartHandler = () => {
    addItemToCart({
      _id: product._id,
      title: product.title,
      description: product.description,
      img: product.img,
      price: product.price,
      quantity: 1,
      colors: product.colors,
      sizes: product.sizes,
      inStock: product.inStock,
      categories: product.categories,
    });
    toast.success("Cart", {
      description: `${product.title} added to cart`,
      duration: 2000,
    });
  };
  const addToWishListHandler = () => {
    addItemToWishList({
      _id: product._id,
      title: product.title,
      description: product.description,
      img: product.img,
      price: product.price,
      quantity: 1,
      colors: product.colors,
      sizes: product.sizes,
      inStock: product.inStock,
      categories: product.categories,
    });
    toast.success("Wish List", {
      description: `${product.title} added to wish list`,
      duration: 2000,
    });
  };
  return (
    <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
      <div
        className="flex items-end justify-end h-56 w-full bg-cover"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1577655197620-704858b270ac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1280&q=144)`,
        }}
      >
        <button
          className="z-10 p-2 rounded-full bg-pink-600 text-white mx-3 -mb-4 hover:bg-pink-500 focus:outline-none focus:bg-pink-500"
          onClick={addToCartHandler}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </button>
        <button
          className="z-10 p-2 rounded-full bg-pink-600 text-white mx-5 -mb-4 hover:bg-pink-500 focus:outline-none focus:bg-pink-500"
          onClick={addToWishListHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 256 256"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
          >
            <path
              fill="#fff"
              d="M45 84.334L6.802 46.136A23.07 23.07 0 010 29.716a23.07 23.07 0 016.802-16.42 23.07 23.07 0 0116.42-6.802 23.07 23.07 0 0116.42 6.802L45 18.654l5.358-5.358a23.07 23.07 0 0116.42-6.802 23.07 23.07 0 0116.42 6.802A23.065 23.065 0 0190 29.716a23.065 23.065 0 01-6.802 16.42L45 84.334zm-21.778-73.84c-5.134 0-9.961 2-13.592 5.63S4 24.582 4 29.716s2 9.961 5.63 13.592L45 78.678l35.37-35.37C84.001 39.677 86 34.85 86 29.716s-1.999-9.961-5.63-13.592a19.098 19.098 0 00-13.592-5.63 19.1 19.1 0 00-13.592 5.63L45 24.311l-8.187-8.187a19.096 19.096 0 00-13.591-5.63z"
              transform="matrix(2.81 0 0 2.81 1.407 1.407)"
            ></path>
          </svg>
        </button>
      </div>
      <div className="px-5 py-3">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-gray-700 uppercase">{product.title}</h3>
          <span className="text-gray-500 mt-2">$12</span>
        </Link>
      </div>
    </div>
  );
}

export default Products;
