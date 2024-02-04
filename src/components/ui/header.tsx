import getCurrentUser from "@/auth/getCurrentUser";
import Link from "next/link";
import React from "react";

const Header = async () => {
  const user = await getCurrentUser();

  return (
    <header className="w-full h-16 flex justify-between items-center">
      {user ? (
        <a href="/signout">Sign Out</a>
      ) : (
        <ul>
          <li>
            <Link href="/signin">Sign In</Link>
          </li>
          <li>
            <Link href="/signup">Create Account</Link>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Header;
