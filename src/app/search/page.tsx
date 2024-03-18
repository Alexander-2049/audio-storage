"use client";
import API from "@/utils/API";
import {
  QueryFunctionContext,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
// import { PlayerContext } from "@/components/AudioPlayer/context/playerContext";
import { /* useRouter, */ useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { useContext } from "react";

async function testFunction(value: QueryFunctionContext) {
  const query = value.queryKey[1] || "";
  if (typeof query !== "string") return [];
  if (query.length <= 2) return [];

  const response = await API.POST("/api/music/search", {
    query,
  });

  const decoded_data = await response.json();

  return decoded_data;
}

const SearchPage = () => {
  // const { song_id, setSongId } = useContext(PlayerContext);
  const searchParams = useSearchParams();
  // Access the client
  const queryClient = useQueryClient();
  const [searchKeywords, setSearchKeywords] = useState("");

  // Queries
  const query = useQuery({
    queryKey: ["search_query", searchKeywords],
    queryFn: testFunction,
  });
  // const router = useRouter();
  useEffect(() => {
    setSearchKeywords(searchParams.get("q") || "");
  }, [searchParams]);

  return (
    <div className="w-full h-full">
      {searchParams.get("q") && !query.isFetched ? (
        <h2>Searching for {searchParams.get("q")}...</h2>
      ) : null}
      <ul>
        {Array.isArray(query.data) &&
          query.data.map((song) => {
            return <li key={`search_${song.song_id}`}>{song.song_name}</li>;
          })}
      </ul>
    </div>
  );
};

export default SearchPage;
