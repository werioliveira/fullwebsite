import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const DropdownProfile = () => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col dropDownProfile">
      <ul className="flex flex-col gap-4">
        <li>{session?.user?.name}</li>
        <Link href="/profile">
          <li>Profile</li>
        </Link>
        <button className="cursor-pointer" onClick={signOut}>
          Logout
        </button>
      </ul>
    </div>
  );
};

export default DropdownProfile;
