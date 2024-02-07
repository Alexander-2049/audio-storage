import { IUser } from "@/models/User";
import { Button } from "../ui/button";
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon } from "./PlayerIcons";

export default function PlayerFooter({user}: {user: IUser | null}) {
  return (
    <footer className="flex items-center gap-4 border-t bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <Button className="h-8 w-8" size="icon" variant="outline">
        <ArrowLeftIcon className="h-4 w-4" />
        <span className="sr-only">Previous</span>
      </Button>
      <Button className="h-8 w-8" size="icon" variant="outline">
        <PlayIcon className="h-4 w-4" />
        <span className="sr-only">Play</span>
      </Button>
      <Button className="h-8 w-8" size="icon" variant="outline">
        <ArrowRightIcon className="h-4 w-4" />
        <span className="sr-only">Next</span>
      </Button>
    </footer>
  );
}
