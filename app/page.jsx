"use client";
import { Toaster } from "sonner";
import Products from "./components/Products";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { updateWish } from "./_actions";
import FilterSection from "./components/FilterSection";
import ProductSection from "./components/ProductSection";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [products, setProducts] = useState([]);

  /*
  useEffect(() => {
    async function handleSubmit() {
      const { wishItems } = JSON.parse(localStorage.getItem("wishList") || []);

      await updateWish(wishItems, "weryoliveira1@gmail.com");
    }
    handleSubmit();
  }, []);
  */

  // Handle the error state

  return (
    <main className="flex min-h-screen items-center md:items-start justify-between p-2 md:flex-row flex-col">
      <div className="flex mt-16 md:w-1/4 w-full items-center justify-center ">
        <FilterSection />
      </div>
      <div className="mt-16 w-3/4 mr-6">
        <h3 className="text-gray-600 text-2xl font-medium">Fashions</h3>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-6">
          <ProductSection />
          <Toaster expand={false} position="top-right" richColors closeButton />
        </div>
      </div>
    </main>
  );
}
