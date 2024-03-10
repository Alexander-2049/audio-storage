"use client";
import { useState, useEffect, useCallback, useRef } from "react";
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
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<null | HTMLAudioElement>(null);

  useEffect(() => {
    const audioPlayer = new AudioPlayer();
    setPlayer(audioPlayer);
    navigator.mediaSession.playbackState = "none";

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
        const songInfo = await AudioPlayer.requestSongInfo("z3_29392327");
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

  const togglePlay = useCallback(async () => {
    if (!songData || !player) return;

    try {
      if (!isPlaying) {
        await player.play(songData.song_id);
        navigator.mediaSession.playbackState = "playing";
      } else {
        navigator.mediaSession.playbackState = "paused";
        player.pause();
      }
      setIsPlaying((prev) => !prev);
    } catch (error) {
      console.error("Error playing:", error);
    }
  }, [songData, player, isPlaying]);

  useEffect(() => {
    if (audioRef.current === null) return;
    const element = audioRef.current;
    element.play();
    // navigator.mediaSession.setActionHandler("play", togglePlay);
    // navigator.mediaSession.setActionHandler("pause", togglePlay);
  }, [audioRef, togglePlay]);

  useEffect(() => {
    function play() {
      togglePlay();
    }
    function pause() {
      togglePlay();
    }
    function handleMediaKey() {
      togglePlay();
    }

    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
    if(!songData) return;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: songData.title,
      artist: songData.artist,
      artwork: [
        {
          src: "https://dummyimage.com/512x512",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    });
    navigator.mediaSession.setActionHandler("play", handleMediaKey);
    navigator.mediaSession.setActionHandler("pause", handleMediaKey);
    navigator.mediaSession.setActionHandler("stop", handleMediaKey);
    navigator.mediaSession.setActionHandler("nexttrack", handleMediaKey);
    navigator.mediaSession.setActionHandler("previoustrack", handleMediaKey);

    // return () => {
    // document.removeEventListener("play", play);
    // document.removeEventListener("pause", pause);
    // };
  }, [togglePlay, songData]);

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
      <audio controls={false} loop={true} src={"silence.mp3"} ref={audioRef} />
      <input type="range" step="0.01" min="-1" max="1" value={volume} onChange={(e) => {
        const updated_volume = Number(e.target.value).valueOf();
        setVolume(updated_volume);
        player.setVolume(updated_volume);
      }}/>
    </footer>
  );
}
