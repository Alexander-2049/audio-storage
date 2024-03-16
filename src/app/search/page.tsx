"use client";
import { PlayerContext } from "@/components/AudioPlayer/context/playerContext";
import { useContext } from "react";

const SearchPage = () => {
  const { song_id, setSongId } = useContext(PlayerContext);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <h2>Search</h2>
      <button
        onClick={() => {
          setSongId((prev) => {
            if (prev === null) {
              return "|";
            } else {
              return prev + "|";
            }
          });
        }}
      >
        {song_id || "Click here"}
      </button>
    </div>
  );
};

export default SearchPage;
