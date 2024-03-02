"use client";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon } from "./PlayerIcons";
import { PauseIcon } from "@radix-ui/react-icons";
import { AudioPlayer, SongInterface } from "./models/AudioPlayer";

export default function PlayerFooter() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<AudioPlayer | null>(null);
  const [songData, setSongData] = useState<SongInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audioPlayer = new AudioPlayer();
    setPlayer(audioPlayer);
    return () => {
      audioPlayer.pause(); // Pause playback when unmounting
    };
  }, []);

  useEffect(() => {
    let interval = setTimeout(() => {});
    if (player) {
      interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 100);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [player]);

  useEffect(() => {
    async function fetchSongData() {
      try {
        const songInfo = await AudioPlayer.requestSongInfo("z3_40466454");
        if (songInfo) {
          setSongData(songInfo);
          if (player) {
            await player.addSongToPlaylist(songInfo); // Add song to playlist
          }
        } else {
          setError("Song data not found.");
        }
      } catch (error) {
        console.error("Error fetching song data:", error);
        setError("Error fetching song data.");
      } finally {
        setLoading(false);
      }
    }

    if (player) {
      fetchSongData();
    }
  }, [player]);

  async function togglePlay() {
    if (!songData || !player) return;

    try {
      if (!isPlaying) {
        await player.play(songData.song_id);
      } else {
        player.pause();
      }
      setIsPlaying((prev) => !prev);
    } catch (error) {
      console.error("Error playing:", error);
    }
  }

  if (!player || loading)
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

  if (error)
    return (
      <footer className="flex items-center gap-4 border-t bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <p className="text-red-500">{error}</p>
      </footer>
    );

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
      <Button
        className="h-8 w-8"
        size="icon"
        variant="outline"
        onClick={() => {
          player.moveTo(10);
        }}
      >
        <ArrowRightIcon className="h-4 w-4" />
        <span className="sr-only">Next</span>
      </Button>
      <span>
        {currentTime.toFixed(0)} / {songData?.duration}
      </span>
    </footer>
  );
}
