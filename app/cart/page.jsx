"use client";
import CartContext from "@/context/CartContext";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { Toaster, toast } from "sonner";

const Page = () => {
  const { cart, addItemToCart, deleteItemFromCart } = useContext(CartContext);
  const { data: session } = useSession();
  const router = useRouter();
  const increaseQuantity = (cartItem) => {
    const newQuantity = cartItem?.quantity + 1;
    const item = { ...cartItem, quantity: newQuantity };
    /*
		if (newQuantity > Number(cartItem.stock))
			return toast.error("Cart", {
				description: "Quantity out of stock",
				duration: 2000,
			});
            */
    addItemToCart(item);
  };
  const decreaseQuantity = (cartItem) => {
    const newQuantity = cartItem?.quantity - 1;
    const item = { ...cartItem, quantity: newQuantity };

    if (newQuantity < 1)
      return toast.error("Cart", {
        description: "Quantity need be bigger than 0",
        duration: 2000,
      });

    addItemToCart(item);
  };
  const handleDeleteItem = (id) => {
    deleteItemFromCart(id);
    toast.success("Cart", {
      description: `item removed from cart`,
      duration: 2000,
    });
  };
  const amount = cart?.cartItems?.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const checkout = async (id) => {
    if (!session) {
      router.push("/");
    } else {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: cart.cartItems,
            email: session.user.email,
            totalPrice: amount,
            status: "Not paid",
            order_id_paypal: id,
          }),
        });
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    /*
    await fetch("http://localhost:3000/api/checkout1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products: cart.cartItems }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response);
        if (response.url) {
          window.location.href = response.url;
        }
      });
      const res = await fetch("/api/checkout1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart.cartItems, amount }),
      });
      const order = await res.json();

      return order.id;
    }}
    /*
    if (!session) {
      router.push("/");
    } else {
      try {
        const res = await fetch("http://localhost:3000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: cart.cartItems,
            email: session.user.email,
            totalPrice: amount,
            status: "Not paid",
            intent_id: "",
          }),
        });
        const data = await res.json();
        router.push(`/pay/${data._id}`);
      } catch (error) {
        console.log(error);
      }
    }
    /*


    /*
    await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: cart.cartItems,
        email: session.user.email,
        totalPrice: amount,
      }),
    });
    */
  };

  return (
    <div className="h-screen bg-gray-100 pt-20">
      <Toaster expand={false} position="top-right" richColors closeButton />
      <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
      {cart?.cartItems?.length > 0 ? (
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            {cart?.cartItems?.map((item, index) => (
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
                  <div className="mt-5 sm:mt-0 ">
                    <h2 className="text-lg font-bold text-gray-900">
                      {item?.title}
                    </h2>
                    <div className="flex flex-col">
                      <p className="mt-1 text-xs text-gray-700 flex flex-col">
                        <span className="text-gray-700 text-xs font-semibold">
                          Size{" "}
                        </span>
                        {item?.sizes.toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs text-gray-700  flex flex-col">
                        <span className="text-gray-700 text-xs font-semibold">
                          Color{" "}
                        </span>
                        {item?.colors.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                    <div className="flex items-center border-gray-100">
                      <span
                        className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-pink-500 hover:text-blue-50"
                        onClick={() => decreaseQuantity(item)}
                      >
                        -
                      </span>
                      <input
                        className="h-8 w-8 border bg-white text-center text-xs outline-none"
                        type="number"
                        value={item?.quantity}
                        readOnly
                      />
                      <span
                        className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-pink-500 hover:text-blue-50"
                        onClick={() => increaseQuantity(item)}
                      >
                        +
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-sm">{item?.price} R$</p>
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

          <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
            <div className="mb-2 flex justify-between">
              <p className="text-gray-700">Subtotal</p>
              <p className="text-gray-700">{amount} R$</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700">Shipping</p>
              <p className="text-gray-700">$4.99</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-2">
              <p className="text-lg font-bold">Total</p>
              <div className="">
                <p className="mb-1 text-lg font-bold">{amount} R$</p>
                <p className="text-sm text-gray-700">including VAT</p>
              </div>
            </div>
            {/* 
                        <button
              className="mt-6 w-full rounded-md bg-pink-500 py-1.5 font-medium text-blue-50 hover:bg-pink-600"
              onClick={checkout}
            >
              Check out
            </button>
            */}

            <PayPalScriptProvider
              options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency: "BRL",
              }}
            >
              <PayPalButtons
                style={{ color: "black" }}
                createOrder={async () => {
                  const res = await fetch("/api/checkout-paypal", {
                    method: "POST",
                    body: JSON.stringify({ items: cart.cartItems, amount }),
                  });
                  const order = await res.json();
                  await checkout(order.id);
                  return order.id;
                }}
                onApprove={async (data, actions) => {
                  actions.order.capture();

                  await fetch(`/api/confirm/${data.orderID}`, {
                    method: "PUT",
                  });
                  router.push("/orders");
                }}
                onCancel={async (data) => {
                  await fetch(`/api/orders/${data.orderID}`, {
                    method: "DELETE",
                  });
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      ) : (
        <div>No items in cart</div>
      )}
    </div>
  );
};

export default Page;
