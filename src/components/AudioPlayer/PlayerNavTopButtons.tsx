"use client";
import Link from "next/link";
import { HomeIcon, LibraryIcon, SearchIcon } from "./PlayerIcons";
import { usePathname } from "next/navigation";

const PlayerNavTopList = () => {
  const pathname = usePathname();

  const activeStyle = "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 dark:bg-gray-800 dark:hover:text-gray-50 bg-gray-100 text-gray-900 dark:text-gray-50";
  const defaultStyle = "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
  
  return (
    <div>
      <Link
        className={pathname === "/" ? activeStyle : defaultStyle}
        href="/"
      >
        <HomeIcon className="h-4 w-4" />
        Home
      </Link>
      <Link
        className={pathname.startsWith("/search") ? activeStyle : defaultStyle}
        href="/search"
      >
        <SearchIcon className="h-4 w-4" />
        Search
      </Link>
      <Link
        className={pathname.startsWith("/library") ? activeStyle : defaultStyle}
        href="/library"
      >
        <LibraryIcon className="h-4 w-4" />
        Your Library
      </Link>
    </div>
  );
};

export default PlayerNavTopList;
