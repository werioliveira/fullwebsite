"use client";
import CartContext from "@/context/CartContext";
import React, { useContext } from "react";
import { Toaster, toast } from "sonner";

const page = () => {
  const { wishList, deleteItemFromWishList } = useContext(CartContext);

  const handleDeleteItem = (id) => {
    deleteItemFromWishList(id);
    toast.success("wishList", {
      description: `item removed from wishList`,
      duration: 2000,
    });
  };

  return (
    <div className="h-screen bg-gray-100 pt-20">
      <Toaster expand={false} position="top-right" richColors closeButton />
      <h1 className="mb-10 text-center text-2xl font-bold">Wish Items</h1>
      {wishList?.wishItems?.length > 0 ? (
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            {wishList?.wishItems?.map((item, index) => (
              <div
                className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                key={index}
              >
                <img
                  src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="product-image"
                  className="w-full rounded-lg sm:w-40"
                />

                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                  <div className="mt-5 sm:mt-0">
                    <h2 className="text-lg font-bold text-gray-900">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-xs text-gray-700">36EU - 4US</p>
                  </div>
                  <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                    <div className="flex items-center space-x-4">
                      <p className="text-sm">{item.price} R$</p>
                      <button onClick={() => handleDeleteItem(item._id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>No items in wishList</div>
      )}
    </div>
  );
};

export default page;
