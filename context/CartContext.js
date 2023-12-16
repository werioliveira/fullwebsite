"use client";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState([]);
	const router = useRouter();
	useEffect(() => {
		setCartToState();
	}, []);
	const setCartToState = () => {
		setCart(
			localStorage.getItem("cart")
				? JSON.parse(localStorage.getItem("cart"))
				: [],
		);
	};
	const addItemToCart = async ({
		_id,
		title,
		description,
		img,
		price,
		sizes,
		colors,
		quantity = 1,
	}) => {
		const item = {
			_id,
			title,
			description,
			img,
			price,
			sizes,
			colors,
			quantity,
		};
		const isItemExist = cart?.cartItems?.find((i) => i._id === item._id);
		//add quantity conditional if item exist
		let newCartItems;
		if (isItemExist) {
			newCartItems = cart?.cartItems?.map((i) =>
				i._id === isItemExist._id ? item : i,
			);
		} else {
			newCartItems = [...(cart?.cartItems || []), item];
		}
		localStorage.setItem("cart", JSON.stringify({ cartItems: newCartItems }));
		setCartToState();
	};
	const deleteItemFromCart = (id) => {
		const newCartItems = cart?.cartItems?.filter((i) => i._id !== id);
		localStorage.setItem("cart", JSON.stringify({ cartItems: newCartItems }));
		setCartToState();
	};
	return (
		<CartContext.Provider value={{ cart, addItemToCart, deleteItemFromCart }}>
			{children}
		</CartContext.Provider>
	);
};
export default CartContext;
