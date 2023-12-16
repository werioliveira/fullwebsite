import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const DropdownProfile = () => {
	const { data: session } = useSession();
	return (
		<div className="bg-white p-4 w-52 shadow-lg absolute right-14 top-24">
			<ul>
				<li>
					<h2 className="p-2 text-lg rounded-md">{session.user.name}</h2>
				</li>
				<Link href="/profile">
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
	);
};

export default DropdownProfile;
