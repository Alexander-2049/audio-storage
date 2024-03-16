import Link from "next/link";
import { SearchIcon, MusicIcon } from "./PlayerIcons";
import { UserDropdownMenu } from "./PlayerUserDropdown";
import PlayerNavButtons from "./PlayerNavButtons";
import LoginButton from "../auth/LoginButton";
import SignUpButton from "../auth/SignUpButton";
import { Database_User } from "@/server/database/user/User";
import PlayerSearch from "./PlayerSearch";

export default function Header({ user }: { user: Database_User | null }) {
  return (
    <header className="flex items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <Link className="lg:hidden" href="/">
        <MusicIcon className="h-6 w-6" />
        <span className="sr-only">Home</span>
      </Link>
      <div className="w-full flex-1 flex flex-row items-center justify-between">
        <div className="flex flex-row gap-4">
          <PlayerNavButtons />
          <form className="min-w-fit w-96">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <PlayerSearch />
            </div>
          </form>
        </div>
        {user ? (
          <UserDropdownMenu user={user} />
        ) : (
          <ul className="flex gap-2">
            <li>
              <LoginButton />
            </li>
            <li>
              <SignUpButton />
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}
