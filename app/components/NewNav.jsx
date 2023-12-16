"use client";
import CartContext from "@/context/CartContext";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { HiShoppingBag, HiUser } from "react-icons/hi";

const NewNav = () => {
	const [openProfile, setOpenProfile] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const { data: session } = useSession();
	const menuRef = useRef();
	const profileRef = useRef();
	const { cart } = useContext(CartContext);

	useEffect(() => {
		window.addEventListener("click", (e) => {
			if (e.target !== menuRef.current && e.target !== profileRef.current) {
				setOpenProfile(false);
			}
		});
	}, []);

	return (
		<>
			<header className="shadow-md">
				<div className="container mx-auto px-6 py-3 ">
					<div className="flex items-center justify-between">
						<div className="hidden w-full text-gray-600 md:flex md:items-center">
							<span className="mx-1 text-sm">
								<Image
									width={48}
									height={48}
									src="/brasil.svg"
									alt="brasil"></Image>
							</span>
						</div>
						<div className="w-full text-gray-700 md:text-center text-lg font-semibold md:text-2xl">
							WSell
						</div>
						<div className="flex items-center justify-end w-full gap-2 md:gap-8">
							<Link href="/cart">
								<button className="text-gray-600 focus:outline-none mx-4 sm:mx-0 relative">
									<Image
										className="relative"
										width={32}
										height={32}
										src="/shopping-bag.png"
										alt="shopbag"></Image>
									<span className="absolute inset-0 object-right-top -mr-6 -mt-1">
										<div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-pink-500 text-white">
											{cart?.cartItems?.length || 0}
										</div>
									</span>
								</button>
							</Link>
							<button className="relative z-20">
								<Image
									width={32}
									height={32}
									src="/user-128-48.png"
									ref={profileRef}
									onClick={() => setOpenProfile(!openProfile)}
									alt="profile"
								/>
							</button>
							<div className="flex sm:hidden">
								<button
									onClick={() => setIsOpen(!isOpen)}
									type="button"
									className="text-gray-600 hover:text-gray-500 focus:outline-none focus:text-gray-500"
									aria-label="toggle menu">
									<svg
										viewBox="0 0 24 24"
										className="h-6 w-6 fill-current">
										<path
											fillRule="evenodd"
											d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
									</svg>
								</button>
							</div>
							{openProfile && (
								<div
									className="bg-white p-4 w-52 shadow-lg absolute right-14 top-24 rounded-md z-10"
									ref={menuRef}>
									<ul>
										<li>
											<h2 className="p-2 text-lg rounded-md">
												{session.user?.name}
											</h2>
										</li>
										<Link
											href="/profile"
											onClick={() => setOpenProfile(!openProfile)}>
											<li className="p-2 text-lg cursor-pointer rounded-md hover:bg-pink-300 hover:text-white">
												Settings
											</li>
										</Link>
										<li
											className="p-2 text-lg cursor-pointer rounded-md hover:bg-pink-300 hover:text-white"
											onClick={() => signOut()}>
											Logout
										</li>
									</ul>
								</div>
							)}
						</div>
					</div>
					<nav
						className={`${
							isOpen ? "" : "hidden"
						} sm:flex sm:justify-center sm:items-center mt-4`}>
						<div className="flex flex-col sm:flex-row">
							<Link
								href="/"
								className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0">
								Home
							</Link>
							<Link
								href="/profile"
								className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0">
								Profile
							</Link>
							<Link
								href="/protected/client"
								className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0">
								Protected (client)
							</Link>
							<Link
								href="/admin"
								className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0">
								Admin
							</Link>
						</div>
					</nav>
					<div className="relative mt-6 max-w-lg mx-auto">
						<span className="absolute inset-y-0 left-0 pl-3 flex items-center"></span>
					</div>
				</div>
			</header>
		</>
	);
};

export default NewNav;
