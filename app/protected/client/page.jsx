"use client";
import { redirect } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";

const ClientProtectedPage = () => {
  const { data: session } = useSession({
    // required: true,
    //onUnauthenticated() {
    //   redirect("/signin?calllbackUrl=/protected/client");
    // },
  });
  return <div>Protected client page {session?.user?.name}</div>;
};

export default ClientProtectedPage;
