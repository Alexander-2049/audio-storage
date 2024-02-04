import { IUser } from "@/auth/getCurrentUser";
import Link from "next/link";
import React from "react";
import Navigation from "./Navigation";

interface Props {
  user: IUser | null;
}

const Player = ({ user }: Props) => {
  return (
    <div className="w-screen h-screen bg-slate-900 flex flex-col">
      <div className="w-full grow flex flex-row">
        <nav className="shrink-0 h-full bg-gray-700 w-64 flex flex-col">
          <div className="shrink-0 p-2 bg-gray-500">
            <ul>
              <li className="p-2">Home</li>
              <li className="p-2">Search</li>
            </ul>
          </div>
          <div className="grow"></div>
        </nav>
        <div className="grow overflow-auto bg-slate-600">
          <header className="w-full h-20 flex flex-row justify-between items-center">
            <Navigation />
            {user ? (
              <ul>
                <li>
                  <a href="/signout" className="p-4">
                    Sign Out
                  </a>
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  <Link href="/signin" className="p-4">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="p-4">
                    Sign Up
                  </Link>
                </li>
              </ul>
            )}
          </header>
        </div>
        {/* <div className="shrink-0 h-full bg-gray-700 w-64"></div> */}
      </div>
      <div className="w-full h-24 bg-black shrink-0"></div>
    </div>
  );
};

export default Player;
