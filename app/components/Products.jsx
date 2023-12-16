"use client";
import CartContext from "@/context/CartContext";
import Link from "next/link";
import { useContext } from "react";
import { Toaster, toast } from "sonner";

// Write a fetcher function to wrap the native fetch function and return the result of a call to the URL in JSON format
function Products({ product }) {
	const { addItemToCart } = useContext(CartContext);
	const addToCartHandler = () => {
		addItemToCart({
			_id: product._id,
			title: product.title,
			description: product.description,
			img: product.img,
			price: product.price,
			quantity: product.quantity,
			colors: product.colors,
			sizes: product.sizes,
		});
		toast.success("Cart", {
			description: `${product.title} added to cart`,
			duration: 2000,
		});
	};
	return (
		<div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
			<div
				className="flex items-end justify-end h-56 w-full bg-cover"
				style={{
					backgroundImage: `url(https://images.unsplash.com/photo-1577655197620-704858b270ac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1280&q=144)`,
				}}>
				<button
					className="z-10 p-2 rounded-full bg-pink-600 text-white mx-5 -mb-4 hover:bg-pink-500 focus:outline-none focus:bg-pink-500"
					onClick={addToCartHandler}>
					<svg
						className="h-5 w-5"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
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
