"use client";
import CartContext from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
const BricksMP = dynamic(() => import("@/app/components/BricksMP"), {
  ssr: false,
});

const Page = () => {
  const { cart, addItemToCart, deleteItemFromCart } = useContext(CartContext);
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false)
  const [preferenceId, setPreferenceId] = useState('')
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
  const handlePreferenceId=async() =>{
    setIsOpen(true)
    const res = await fetch("/api/process_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({cart}),
    });
    const pref = await res.json();
    setPreferenceId(pref)
    //router.push(`/payment?preferenceId=${pref}`)
  }
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
    <>
    <Toaster
    expand={false}
    position="top-right"
    richColors
    closeButton
    />
    <div className="container max-w-5xl mx-auto px-4 md:px-6 py-12">
      {isOpen ? <BricksMP preferenceId={preferenceId} amount={amount}/> : <></>}
      {cart?.cartItems?.length > 0 ? (

<div className="grid md:grid-cols-[1fr_400px] gap-12">
  <div className="grid gap-8">
    <div>
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      <div className="grid gap-6">
      {cart?.cartItems?.map((item, index) => (
          <div key={index} className="grid grid-cols-[100px_1fr_120px] items-center gap-4">
            <img
              src={`${item.img}`}
              alt="Product Image"
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
<div>
              <h3 className="font-medium">{item?.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                Color: {item?.colors.toUpperCase()} | Size: {item?.sizes.toUpperCase()}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">${item?.price}</div>
              <div className="flex items-center justify-end gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => decreaseQuantity(item)}>
                  <MinusIcon className="w-4 h-4" />
                </Button>
                <div>{item.quantity}</div>
                <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => increaseQuantity(item)}>
                  <PlusIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-6 h-6 hover:text-red-500" onClick={() => handleDeleteItem(item._id)}>
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Separator />
  </div>
  <div className="grid gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Subtotal</div>
          <div className="font-medium">R${amount}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="font-medium">Shipping</div>
          <div className="font-medium">R${0}</div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Total</div>
          <div className="text-2xl font-bold">R${(amount)}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full"  onClick={() => handlePreferenceId()}>Place Order</Button>
      </CardFooter>
    </Card>
  
  </div>
</div>
): (<div> No Items in cart </div>)}
    </div>
    </>
  );
};
function CreditCardIcon(props) {
  return (
    <svg
      {...props}
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
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}


function DollarSignIcon(props) {
  return (
    <svg
      {...props}
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
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}


function MinusIcon(props) {
  return (
    <svg
      {...props}
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
  )
}


function PlusIcon(props) {
  return (
    <svg
      {...props}
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
  )
}


function TrashIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}


function WalletCardsIcon(props) {
  return (
    <svg
      {...props}
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
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
      <path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21" />
    </svg>
  )
}
export default Page;
