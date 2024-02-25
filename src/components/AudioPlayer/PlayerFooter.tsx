"use client";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon } from "./PlayerIcons";
import { PauseIcon } from "@radix-ui/react-icons";

const baseURL = "http://localhost:3000/api/music/chunks";
const songId = "z3_26350387";
const totalSizeBytes = 4781254;
const chunkSize = 100000;

let audioContext: AudioContext | null = null;

if (
  typeof window !== "undefined" &&
  typeof window.AudioContext !== "undefined"
) {
  audioContext = new window.AudioContext();
} else {
  console.error("AudioContext is not supported in this environment");
}

export default function PlayerFooter() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChunkPlaying, setIsChunkPlaying] = useState(false); // Track if a chunk is currently playing

  useEffect(() => {
    return () => {
      if (!audioContext) {
        console.error("AudioContext is not available");
        return;
      }
      if (audioContext.state === "running") {
        audioContext.suspend();
      }
    };
  }, []);

  async function loadAndPlayChunks() {
    if (!audioContext) {
      console.error("AudioContext is not available");
      return;
    }

    let startByte = 0;
    let endByte = chunkSize - 1;

    while (startByte < totalSizeBytes) {
      const response = await fetch(baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Range: `bytes=${startByte}-${endByte}`,
        },
        body: new URLSearchParams({ id: songId }),
      });

      const arrayBuffer = await response.arrayBuffer();
      console.log("Chunk downloaded");

      try {
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        if (!isChunkPlaying) { // Check if no chunk is currently playing
          setIsChunkPlaying(true); // Set flag to indicate a chunk is being played
          await playChunk(audioBuffer); // Play the chunk immediately after it's downloaded
        }
      } catch (error) {
        console.error("Error decoding audio data:", error);
      }

      startByte = endByte + 1;
      endByte = Math.min(startByte + chunkSize - 1, totalSizeBytes - 1);
    }
  }

  async function playChunk(audioBuffer: AudioBuffer) {
    if (!audioContext) {
      console.error("AudioContext is not available");
      return;
    }

    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(audioContext.destination);

    await new Promise<void>((resolve) => {
      sourceNode.onended = () => {
        console.log("Chunk ended");
        setIsChunkPlaying(false); // Reset flag when chunk playback ends
        resolve();
      };
      sourceNode.start();
      console.log("Chunk is playing");
    });
  }

  function togglePlay() {
    if (!audioContext) {
      console.error("AudioContext is not available");
      return;
    }

    setIsPlaying((prevState) => !prevState);
    if (!isPlaying) {
      audioContext.resume().then(() => {
        loadAndPlayChunks().catch((error) =>
          console.error("Error loading song:", error)
        );
      });
    }
  }

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
