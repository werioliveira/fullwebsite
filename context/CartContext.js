"use client";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishList, setWishList] = useState([]);
  const router = useRouter();
  useEffect(() => {
    setCartToState();
    setWishListToState();
  }, []);
  const setCartToState = () => {
    setCart(
      localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : []
    );
  };
  const setWishListToState = () => {
    setWishList(
      localStorage.getItem("wishList")
        ? JSON.parse(localStorage.getItem("wishList"))
        : []
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
    categories,
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
      categories,
    };
    const isItemExist = cart?.cartItems?.find((i) => i._id === item._id);
    //add quantity conditional if item exist
    let newCartItems;
    if (isItemExist) {
      newCartItems = cart?.cartItems?.map((i) =>
        i._id === isItemExist._id ? item : i
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

  const addItemToWishList = async ({
    _id,
    title,
    description,
    img,
    price,
    sizes,
    colors,
    inStock,
    categories,
  }) => {
    const item = {
      _id,
      title,
      description,
      img,
      price,
      sizes,
      colors,
      inStock,
      categories,
    };
    const isItemExist = wishList?.wishItems?.find((i) => i._id === item._id);
    //add quantity conditional if item exist
    let newWishItems;
    if (isItemExist) {
      deleteItemFromWishList(isItemExist._id);
    } else {
      newWishItems = [...(wishList?.wishItems || []), item];
      localStorage.setItem(
        "wishList",
        JSON.stringify({ wishItems: newWishItems })
      );
      setWishListToState();
    }
  };
  const deleteItemFromWishList = (id) => {
    const newWishItems = wishList?.wishItems?.filter((i) => i._id !== id);
    localStorage.setItem(
      "wishList",
      JSON.stringify({ wishItems: newWishItems })
    );
    setWishListToState();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishList,
        addItemToCart,
        deleteItemFromCart,
        addItemToWishList,
        deleteItemFromWishList,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartContext;
