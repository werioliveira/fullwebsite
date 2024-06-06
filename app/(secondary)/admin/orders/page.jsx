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
	const orderStatus = {
		['approved']: 'bg-green-200 text-green-900',
		['rejected']: 'bg-red-200 text-red-900',
		['pending']: 'bg-yellow-300 text-yellow-900',
	}
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

								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
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
												{order.products.map((product,index) => (
													<Link
														href={
															process.env.NEXT_PUBLIC_APP_BASE_URL +
															"/product/" +
															product._id
														}
														key={index}>
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
												<span className={"relative inline-block px-3 py-1 font-semibold leading-tight rounded-full" + orderStatus[order.status]} >
													<span
														aria-hidden
														className={"absolute inset-0 opacity-50 rounded-full " + orderStatus[order.status]}></span>
													<span className="relative">{order.status}</span>
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							<div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
								<span className="text-xs xs:text-sm text-gray-900">
								Showing {(page-1)*perPage +1} to {page*perPage} of {data.itemCount} Entries
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
													<Link
														className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
														href={`?page=${prevPage}`}>
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
													<Link
														className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
														href={`?page=${nextPage}`}>
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
