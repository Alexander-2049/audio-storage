import { IUser } from "@/auth/getCurrentUser";
import React from "react";

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
        <div className="grow"></div>
        {/* <div className="shrink-0 h-full bg-gray-700 w-64"></div> */}
      </div>
      <div className="w-full h-24 bg-black shrink-0"></div>
    </div>
  );
};

export default Player;
