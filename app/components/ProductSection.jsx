"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { convertStringToQueriesObject } from "./FilterSection";
import useSWR from "swr";
import Products from "./Products";
import { sortProductsPrice } from "../lib/sortPrice";
import Loading from "../loading";

const fetcher = (url) => fetch(url).then((res) => res.json());

function isAvaliable(arr1, arr2, category) {
  if (!arr1 || !arr2) {
    return true;
  }
  if (category) return arr1.some((item) => arr2?.includes(item));

  return arr1.some((item) => arr2?.includes(item.text.toLocaleLowerCase()));
}

const ProductSection = () => {
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const paramsObj = convertStringToQueriesObject(searchParams);

  const categories = searchParams.get('categories')
  const colors = searchParams.get('colors')
  const subcategories = searchParams.get('subcategories')
  const sizes = searchParams.get('sizes')
  const prices = searchParams.get('sort')
  let page = parseInt(searchParams.get('page'));
	page = !page || page < 1 ? 1 : page;
	const perPage = process.env.NEXT_PUBLIC_ORDERS_PER_PAGE;

  const filters = [];
  if (categories) filters.push(`categories=${categories}`);
  if (colors) filters.push(`colors=${colors}`);
  if (subcategories) filters.push(`subcategories=${subcategories}`);
  if (sizes) filters.push(`sizes=${sizes}`);
  if (prices) filters.push(`sort=${prices}`);
  if (page) filters.push(`page=${page}`);
  


  const apiUrl = `/api/products?${filters.join('&')}`;
  

  const { data, error } = useSWR(apiUrl, fetcher);

	const totalPages = Math.ceil(data?.itemCount / perPage);

	const prevPage = page - 1 > 0 ? page - 1 : 1;
	const nextPage = page + 1;
	const isPageOutOfRange = page > totalPages;

	const pageNumbers = [];
	const offsetNumber = 3;
	for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
		if (i >= 1 && i <= totalPages) {
			pageNumbers.push(i);
		}
	}
  const handlePages = (newpage) =>{

    const params = new URLSearchParams(searchParams);
    params.set('page',newpage)

    function convertStringToQueriesObject(searchParams) {
      let selectedQueries = {};
      searchParams.forEach((values, key) => {
        const queries = values.split(",");
        if (selectedQueries[key]) {
          selectedQueries[key].push(...queries);
        } else {
          selectedQueries[key] = queries;
        }
      });
      return selectedQueries;
    }
    function convertValidStringQueries(queries) {
      let q = "";
      for (let [key, value] of Object.entries(queries)) {
        if(key != 'page'){

          q = q + `${q === "" ? "" : "&"}${key}=${value}`;
        }
      }
      return q;
    }
    const query = convertStringToQueriesObject(searchParams)
    router.push(`/?${convertValidStringQueries(query)}&page=${newpage}`, {
			scroll: false,
		});
    }
  if (error)
    return (
      <div className="flex justify-center align-center mt-16">
        Cannot load contents
      </div>
    );
  // Handle the loading state
  if (!data) {
    return <Loading/>
  }

  let filteredProducts = data.products.filter((product) => {
    const hasCategories = isAvaliable(
      product.categories,
      paramsObj?.categories,
      true
    );
    const hasSubCategories = isAvaliable(
      product.subcategories,
      paramsObj?.subcategories,
      true
    );
    const hasColors = isAvaliable(product.colors, paramsObj.colors);
    const hasSize = isAvaliable(product.sizes, paramsObj.sizes);

    return hasSize || hasColors || hasCategories || hasSubCategories;
  });

  //DESTRUCTURING SORT PRICE
  filteredProducts = sortProductsPrice(filteredProducts, paramsObj)



  if (Object.keys(paramsObj).length === 0) {
    filteredProducts = data.products;
  }
  if (filteredProducts.length === 0) {
    return (
      <p className="text-center text-slate-700">
        {" "}
        No product Avaliable in this filter
      </p>
    );
  }
  return (
<>
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mt-6">

      {filteredProducts.map((product) => (
        <Products key={product._id} product={product} />
      ))}

</div>
<div className="mt-2">
<div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center justify-center">
                  <span className="text-xs xs:text-sm text-gray-900">
                  Showing {(page-1)*perPage} to {page*perPage} of {data.itemCount} Entries
                  </span>
                  <div className="inline-flex mt-2 xs:mt-0">
                    &nbsp; &nbsp;
                    <div className="flex items-center gap-4">
                      <ol className="flex justify-center gap-1 text-xs font-medium">
                        <li>
                          {page === 1 ? (
                            <div
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 opacity-60"
                            aria-disabled="true">
                              <span className="sr-only">Next Page</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                  />
                              </svg>
                            </div>
                          ) : (
                            <button
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                            onClick={()=> handlePages(prevPage)}
                            >
                              <span className="sr-only">Next Page</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                  />
                              </svg>
                            </button>
  
                          )}
                        </li>
                        {pageNumbers.map((pageNumber, index) => (
                          <button
                          key={index}
                          className={
                            page === pageNumber
                            ? "border-pink-600 bg-pink-600  block h-8 w-8 rounded text-center leading-8 text-white"
                            : "hover:bg-pink-500 block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 hover:text-white"
                          }
                          onClick={()=> handlePages(pageNumber)}
                          >
                            {pageNumber}
                            </button>
  
                        ))}
  
                        <li>
                          {page === totalPages ? (
                            <div
                              className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 opacity-60"
                              aria-disabled="true">
                              <span className="sr-only">Next Page</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                  />
                              </svg>
                            </div>
                          ) : (
                            <button 
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                            onClick={()=> handlePages(nextPage)}
                            >
  <span className="sr-only">Next Page</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                  />
                              </svg>
                            </button>
  
)}
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
</div>

</>
  );
};

export default ProductSection;
