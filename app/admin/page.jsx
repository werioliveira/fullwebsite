import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (session.user.role != "admin") {
    return (
      <div>
        <p> are not autorized</p>
      </div>
    );
  }
  return <div>is admin</div>;
};

export default page;
