"use client";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon } from "./PlayerIcons";
import { PauseIcon } from "@radix-ui/react-icons";
import { AudioPlayer } from "./models/AudioPlayer";

export default function PlayerFooter() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<AudioPlayer | null>(null);

  useEffect(() => {
    setPlayer(new AudioPlayer());
  }, []);

  function togglePlay() {
    setIsPlaying((prev) => !prev);
  }

  if (!player)
    return (
      <footer className="flex items-center gap-4 border-t bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <Button className="h-8 w-8" size="icon" variant="outline">
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button className="h-8 w-8" size="icon" variant="outline">
          <PlayIcon className="h-4 w-4" />
          <span className="sr-only">{"Play"}</span>
        </Button>
        <Button className="h-8 w-8" size="icon" variant="outline">
          <ArrowRightIcon className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </footer>
    );

  // (async () => {
  //   console.log(await AudioPlayer.requestSongInfo("z3_4846216"));
  // })();

  return (
    <footer className="flex items-center gap-4 border-t bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <Button className="h-8 w-8" size="icon" variant="outline">
        <ArrowLeftIcon className="h-4 w-4" />
        <span className="sr-only">Previous</span>
      </Button>
      <Button
        className="h-8 w-8"
        size="icon"
        variant="outline"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <PauseIcon className="h-4 w-4" />
        ) : (
          <PlayIcon className="h-4 w-4" />
        )}
        <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
      </Button>
      <Button className="h-8 w-8" size="icon" variant="outline">
        <ArrowRightIcon className="h-4 w-4" />
        <span className="sr-only">Next</span>
      </Button>
    </footer>
  );
}
