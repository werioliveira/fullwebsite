"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import useSWR from "swr";

const Page = ({ searchParams }) => {
	let page = parseInt(searchParams.page, 10);
	page = !page || page < 1 ? 1 : page;
	const perPage = process.env.NEXT_PUBLIC_ORDERS_PER_PAGE;

	const { data: session, status } = useSession();
	const router = useRouter();

	if (status === "unauthenticated") {
		router.push("/");
	}

	const fetcher = (url) => fetch(url).then((res) => res.json());
	const { data, error } = useSWR(`/api/orders?page=${page}`, fetcher);
	// Handle the error state
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
	if (error)
		return (
			<div className="flex justify-center align-center mt-16">
				Cannot load orders
			</div>
		);
	// Handle the loading state

	if (!data) {
		return (
			<div
				role="status"
				className="flex justify-center align-center mt-16">
				<svg
					aria-hidden="true"
					className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pink-500"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
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
		<div>
			<div className="bg-white p-8 rounded-md w-full">
				<div className=" flex items-center justify-between pb-6">
					<div>
						<h2 className="text-gray-600 font-semibold">Products Oder</h2>
						<span className="text-xs">All products item</span>
					</div>
				</div>
				<div>
					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
						<div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
							<table className="min-w-full leading-normal">
								<thead>
									<tr>
										<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
											OrderId
										</th>
										<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
											products
										</th>
										<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
											Created at
										</th>
										<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
											Price
										</th>
										<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
											Status
										</th>
									</tr>
								</thead>
								<tbody>
									{data.orders.map((order) => (
										<tr key={order._id}>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<div className="flex items-center">
													<div className="ml-3">
														<p className="text-gray-900 whitespace-no-wrap">
															{order._id.toString().slice(0, 5)}
														</p>
													</div>
												</div>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												{order.products.map((product) => (
													<Link
														href={
															process.env.NEXT_PUBLIC_APP_BASE_URL +
															"/product/" +
															product._id
														}
														key={product._id}>
														<p className="text-gray-900 whitespace-no-wrap">
															{product.title}
														</p>
													</Link>
												))}
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<p className="text-gray-900 whitespace-no-wrap">
													{new Date(order.createdAt).toLocaleString()}
												</p>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<p className="text-gray-900 whitespace-no-wrap">
													R$ {order.totalPrice}
												</p>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
													<span
														aria-hidden
														className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
													<span className="relative">{order.status}</span>
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							<div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
								<span className="text-xs xs:text-sm text-gray-900">
									Showing 1 to {perPage} of {data.itemCount} Entries
								</span>
								<div className="inline-flex mt-2 xs:mt-0">
									&nbsp; &nbsp;
									<div className="flex items-center gap-4">
										<ol class="flex justify-center gap-1 text-xs font-medium">
											<li>
												{page === 1 ? (
													<div
														className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 opacity-60"
														aria-disabled="true">
														<span class="sr-only">Next Page</span>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-3 w-3"
															viewBox="0 0 20 20"
															fill="currentColor">
															<path
																fill-rule="evenodd"
																d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
																clip-rule="evenodd"
															/>
														</svg>
													</div>
												) : (
													<Link
														className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
														href={`?page=${prevPage}`}>
														<span class="sr-only">Next Page</span>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-3 w-3"
															viewBox="0 0 20 20"
															fill="currentColor">
															<path
																fill-rule="evenodd"
																d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
																clip-rule="evenodd"
															/>
														</svg>
													</Link>
												)}
											</li>
											{pageNumbers.map((pageNumber, index) => (
												<Link
													key={index}
													className={
														page === pageNumber
															? "border-pink-600 bg-pink-600  block h-8 w-8 rounded text-center leading-8 text-white"
															: "hover:bg-pink-500 block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 hover:text-white"
													}
													href={`?page=${pageNumber}`}>
													{pageNumber}
												</Link>
											))}

											<li>
												{page === totalPages ? (
													<div
														className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 opacity-60"
														aria-disabled="true">
														<span class="sr-only">Next Page</span>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-3 w-3"
															viewBox="0 0 20 20"
															fill="currentColor">
															<path
																fill-rule="evenodd"
																d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
																clip-rule="evenodd"
															/>
														</svg>
													</div>
												) : (
													<Link
														className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
														href={`?page=${nextPage}`}>
														<span class="sr-only">Next Page</span>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-3 w-3"
															viewBox="0 0 20 20"
															fill="currentColor">
															<path
																fill-rule="evenodd"
																d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
																clip-rule="evenodd"
															/>
														</svg>
													</Link>
												)}
											</li>
										</ol>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
