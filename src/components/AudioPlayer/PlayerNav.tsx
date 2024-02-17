import Link from "next/link";
import { BellIcon, MusicIcon } from "./PlayerIcons";
import { Button } from "../ui/button";
import { Database_User } from "@/server/database/user/User";
import PlayerNavTopButtons from "./PlayerNavTopButtons";

export default function NavigationMenu({ user }: { user: Database_User | null }) {
  return (
    <nav className="hidden items-start text-sm font-medium lg:grid">
      <div className="h-full border-r bg-gray-100/40 dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <MusicIcon className="h-6 w-6" />
              <span className="">Audio Storage</span>
            </Link>
            <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <PlayerNavTopButtons />
              <h2 className="mt-4 mb-2 text-gray-900 dark:text-gray-50">
                Playlists
              </h2>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                Workout Mix
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                Chill Vibes
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                Focus
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                Party Hits
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
}
