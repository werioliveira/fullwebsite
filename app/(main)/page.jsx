import { Toaster } from "sonner";
import FilterSection from "../components/FilterSection";
import ProductSection from "../components/ProductSection";
import { Suspense } from "react";
import LoadingProducts from "./loading";
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
					<Suspense fallback={<Loading/>}>
						<FilterSection />
					</Suspense>
				</div>
				<div className="mt-16 w-3/4 m-6 flex flex-col justify-center">
					<h3 className="p-2 text-gray-600 text-2xl font-medium text-center md:text-left">Fashions</h3>
					<div className="flex flex-col p-2">
						<Suspense fallback={<LoadingProducts/>} >
							<ProductSection />
						</Suspense>
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
