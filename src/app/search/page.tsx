"use client";
// import { PlayerContext } from "@/components/AudioPlayer/context/playerContext";
import { /* useRouter, */ useSearchParams } from "next/navigation";
// import { useContext } from "react";

const SearchPage = () => {
  // const { song_id, setSongId } = useContext(PlayerContext);
  const searchParams = useSearchParams();
  // const router = useRouter();

  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      {searchParams.get("q") ? (
        <h2>Searching for {searchParams.get("q")}...</h2>
      ) : null}
    </div>
  );
};

export default SearchPage;
