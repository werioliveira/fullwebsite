"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { updateName } from "../_actions";
import { Toaster, toast } from "sonner";

const ProfileForm = () => {
	const { data: session, update } = useSession();
	async function handleSubmit(formData) {
		const { name, email } = Object.fromEntries(formData.entries());
		if (!name || !email)
			return toast.error("Profile", {
				description: "name or email empty",
				duration: 2000,
			});
		await updateName(name, email);
		await update({ name });
		toast.success("Profile", {
			description: "Name updated sucessfully",
			duration: 2000,
		});
	}
	return (
		<>
			<form action={handleSubmit}>
				<input
					type="hidden"
					name="email"
					value={session?.user?.email}
				/>
				<input
					type="text"
					name="name"
					defaultValue={session?.user?.name}
				/>
				<button>Update</button>
			</form>
			<Toaster
				expand={false}
				position="top-right"
				richColors
				closeButton
			/>
		</>
	);
};

export default ProfileForm;
