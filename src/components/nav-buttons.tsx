"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { BackIcon, ForwardIcon } from "./icons";

const NavButtons = () => {
  const router = useRouter();
  return (
    <ul className="flex flex-row items-center gap-1">
      <li>
        <Button
          className="h-8 w-8"
          size="icon"
          variant="outline"
          onClick={() => router.back()}
        >
          <BackIcon className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
      </li>
      <li>
        <Button
          className="h-8 w-8"
          size="icon"
          variant="outline"
          onClick={() => router.forward()}
        >
          <ForwardIcon className="h-4 w-4" />
          <span className="sr-only">Forward</span>
        </Button>
      </li>
    </ul>
  );
};

export default NavButtons;
