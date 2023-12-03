import { redirect } from "next/navigation";
import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ServerProtectedPage = async () => {
  const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/signin?calllbackUrl=/protected/server");
  // }
  return <div>Protected server page {session?.user?.name}</div>;
};

export default ServerProtectedPage;
