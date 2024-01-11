import { Toaster } from "sonner";
import FilterSection from "../components/FilterSection";
import ProductSection from "../components/ProductSection";
import { Suspense } from "react";
import Loading from "../loading";

const Home = () => {
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
		<div className="flex w-full justify-center">
			<main className="flex min-h-screen items-center md:items-start p-2 md:flex-row flex-col w-[90%] justify-center">
				<div className="flex mt-16 md:w-1/4 w-full items-center justify-center ">
					<FilterSection />
				</div>
				<div className="mt-16 w-3/4 mr-6">
					<h3 className="text-gray-600 text-2xl font-medium">Fashions</h3>
					<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-6 mr-12">
						<ProductSection />
						<Toaster
							expand={false}
							position="top-right"
							richColors
							closeButton
						/>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Home;
