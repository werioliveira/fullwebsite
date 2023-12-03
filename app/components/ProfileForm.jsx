"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { updateName } from "../_actions";

const ProfileForm = () => {
  const { data: session, update } = useSession();
  async function handleSubmit(formData) {
    const { name, email } = Object.fromEntries(formData.entries());
    if (!name || !email) return;
    await updateName(name, email);
    await update({ name });
    toast("Name updated sucessfully", {
      theme: "dark",
      type: "success",
      autoClose: 2000,
    });
  }
  return (
    <>
      <form action={handleSubmit}>
        <input type="hidden" name="email" value={session?.user?.email} />
        <input type="text" name="name" defaultValue={session?.user?.name} />
        <button>Update</button>
      </form>
      <ToastContainer />
    </>
  );
};

export default ProfileForm;
