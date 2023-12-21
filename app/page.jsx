"use client";
import { Toaster } from "sonner";
import Products from "./components/Products";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("/api/products/", fetcher);
  // Handle the error state
  if (error)
    return (
      <div className="flex justify-center align-center mt-16">
        Cannot load contents
      </div>
    );
  // Handle the loading state
  if (!data) {
    return (
      <div role="status" className="flex justify-center align-center mt-16">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pink-500"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  return (
    <main className="flex min-h-screen items-center md:items-start justify-between p-2 md:flex-row flex-col">
      <div className="flex mt-16 md:w-1/4 w-full items-center justify-center ">
        <details
          open
          className="mr-3 max-w-md w-full md:w-3/4 overflow-hidden rounded-lg border border-gray-200 open:shadow-lg text-gray-700"
        >
          <summary className="flex cursor-pointer items-center justify-between bg-gray-100 px-5 py-3">
            <span className="text-sm font-medium"> Toggle Filters </span>

            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </summary>

          <form
            action=""
            className="flex border-t border-gray-200 lg:border-t-0 flex-col"
          >
            <fieldset className="w-full">
              <legend className="block w-full bg-gray-50 px-5 py-3 text-xs font-medium">
                Type
              </legend>

              <div className="space-y-2 px-5 py-6">
                <div className="flex items-center">
                  <input
                    id="New"
                    type="checkbox"
                    name="type[New]"
                    className="h-5 w-5 rounded border-gray-300"
                  />

                  <label htmlFor="New" className="ml-3 text-sm font-medium">
                    {" "}
                    New{" "}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="Used"
                    type="checkbox"
                    name="type[Used]"
                    className="h-5 w-5 rounded border-gray-300"
                  />

                  <label htmlFor="Used" className="ml-3 text-sm font-medium">
                    {" "}
                    Used{" "}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="Branded"
                    type="checkbox"
                    name="type[Branded]"
                    className="h-5 w-5 rounded border-gray-300"
                  />

                  <label htmlFor="Branded" className="ml-3 text-sm font-medium">
                    {" "}
                    Branded{" "}
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="text-xs text-gray-500 underline"
                  >
                    Reset Type
                  </button>
                </div>
              </div>
            </fieldset>

            <fieldset className="w-full">
              <legend className="block w-full bg-gray-50 px-5 py-3 text-xs font-medium">
                Price
              </legend>

              <div className="space-y-2 px-5 py-6">
                <div className="flex items-center">
                  <input
                    id="300+"
                    type="radio"
                    name="Price"
                    value="300+"
                    className="h-5 w-5 rounded border-gray-300"
                  />

                  <label htmlFor="300+" className="ml-3 text-sm font-medium">
                    {" "}
                    300+{" "}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="600+"
                    type="radio"
                    name="Price"
                    value="600+"
                    className="h-5 w-5 rounded border-gray-300"
                  />

                  <label htmlFor="600+" className="ml-3 text-sm font-medium">
                    {" "}
                    600+{" "}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="1500+"
                    type="radio"
                    name="Price"
                    value="1500+"
                    className="h-5 w-5 rounded border-gray-300"
                  />

                  <label htmlFor="1500+" className="ml-3 text-sm font-medium">
                    {" "}
                    1500+{" "}
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="text-xs text-gray-500 underline"
                  >
                    Reset Price
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
          <div className="">
            <div className="flex justify-between border-t border-gray-200 px-5 py-3">
              <button
                name="reset"
                type="button"
                className="rounded text-xs font-medium text-gray-600 underline"
              >
                Reset All
              </button>

              <button
                name="commit"
                type="button"
                className="rounded bg-blue-600 px-5 py-3 text-xs font-medium text-white active:scale-95"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </details>
      </div>
      <div className="mt-16 w-3/4 mr-6">
        <h3 className="text-gray-600 text-2xl font-medium">Fashions</h3>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-6">
          {data.map(
            (product) =>
              product.inStock == true && (
                <Products key={product._id} product={product} />
              )
          )}
          <Toaster expand={false} position="top-right" richColors closeButton />
        </div>
      </div>
    </main>
  );
}
