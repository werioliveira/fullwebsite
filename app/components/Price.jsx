import CartContext from "@/context/CartContext";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const Price = ({ price, sizes, colors, params, data }) => {
  const [total, setTotal] = useState(price);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);

  useEffect(() => {
    setTotal(
      quantity * (price + colors[selected].price + sizes[selectedSize].price)
    );
  }, [quantity, selected, selectedSize, price, sizes, colors]);
  const { addItemToCart, addItemToWishList, wishList } =
    useContext(CartContext);
  const addToCartHandler = () => {
    addItemToCart({
      _id: data._id,
      title: data.title,
      description: data.description,
      img: data.img,
      price: price + colors[selected].price + sizes[selectedSize].price,
      quantity: quantity,
      colors: colors[selected].text,
      sizes: sizes[selectedSize].text,
    });
    toast.success("Cart", {
      description: `${data.title} added to cart`,
      duration: 2000,
    });
  };

  const addToWishListHandler = () => {
    addItemToWishList({
      _id: data._id,
      title: data.title,
      description: data.description,
      img: data.img,
      price: total,
      quantity: quantity,
      colors: colors[selected].text,
      sizes: colors[selected].text,
    });
  };
  return (
    <div>
      <div className="flex flex-col mt-6 items-start pb-5 border-b-2 border-gray-200 mb-5 gap-6">
        <div className="flex flex-col">
          <span className="font-bold text-gray-700 ">Select Color:</span>
          <div className="mt-6">
            {colors.map((color, index) => (
              <button
                style={{
                  backgroundColor: color.text,
                  outlineColor:
                    selected === index
                      ? color.text && color.text === "white"
                        ? "rgb(236 72 153)"
                        : color.text
                      : "none",
                  outlineStyle: selected === index ? "solid" : "none",
                  outlineWidth: selected === index ? 2 : 0,
                }}
                key={color._id}
                className="border-2 border-gray-300 ml-1 rounded-full w-6 h-6"
                onClick={() => setSelected(index)}
              ></button>
            ))}
          </div>
        </div>
        <div className="flex items-start">
          <div className="relative">
            <div className="mb-4">
              <span className="font-bold text-gray-700 ">Select Size:</span>

              <div className="flex items-center mt-2">
                {sizes.map((size, index) => (
                  <button
                    style={{
                      backgroundColor:
                        selectedSize === index
                          ? "rgb(236 72 153)"
                          : "rgb(55 65 81)",
                    }}
                    className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600"
                    onClick={() => setSelectedSize(index)}
                    key={index}
                  >
                    {size.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start">
          <div className="mb-4">
            <span className="font-bold text-gray-700 ">Select Quantity:</span>
            <div
              className="bg-white border border-gray-200 rounded-lg "
              data-hs-input-number
            >
              <div className="w-full flex justify-between items-center gap-x-1">
                <div className="grow py-2 px-3">
                  <input
                    className="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 "
                    type="text"
                    value={quantity}
                    disabled
                    data-hs-input-number-input
                  />
                </div>
                <div className="flex items-center -gap-y-px divide-x divide-gray-200 border-s border-gray-200 ">
                  <button
                    type="button"
                    className="w-10 h-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium last:rounded-e-lg bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none "
                    data-hs-input-number-decrement
                    onClick={() =>
                      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                  >
                    <svg
                      className="flex-shrink-0 w-3.5 h-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium last:rounded-e-lg bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none "
                    data-hs-input-number-increment
                    onClick={() =>
                      setQuantity((prev) => (prev < 9 ? prev + 1 : 9))
                    }
                  >
                    <svg
                      className="flex-shrink-0 w-3.5 h-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <span className="title-font font-medium text-2xl text-gray-900">
          {total} R$
        </span>
        <button
          className="flex ml-auto text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded"
          onClick={addToCartHandler}
        >
          Add to Cart
        </button>

        {wishList?.wishItems?.some(
          (element) => element._id === params.productId
        ) ? (
          <button
            className="rounded-full w-10 h-10 bg-red-200 p-0 border-0 inline-flex items-center justify-center text-red-500 ml-4"
            onClick={addToWishListHandler}
          >
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
            </svg>
          </button>
        ) : (
          <button
            className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-red-500 ml-4"
            onClick={addToWishListHandler}
          >
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Price;
