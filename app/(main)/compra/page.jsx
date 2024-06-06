"use client"
import CartContext from "@/context/CartContext";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";

const CheckoutMercadoPago = dynamic(() => import("@/app/components/CheckoutMercadoPago"), {
  ssr: false,
});

export default function Home() {
    const { cart } = useContext(CartContext);
    const searchParams = useSearchParams();
    const id = searchParams.get('preferenceId')
    const amount = cart?.cartItems?.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );
  return (
    <>
      <main>
        <CheckoutMercadoPago preferenceId={id} amount={amount} cart={cart.cartItems}/>
      </main>
    </>
  );
}