import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ProfileForm from "../components/ProfileForm";

const Page = async () => {
  //const session = await getServerSession(authOptions);
  //if (!session) redirect("/signin?callbackUrl=/profile");
  return (
    <div>
      <ProfileForm />
    </div>
  );
};

export default Page;
