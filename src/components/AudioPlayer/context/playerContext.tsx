"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { Song } from "../models/AudioPlayer";

interface I_PlayerContext {
  song_id: string | null;
  playlist: Song[];
  setSongId: Dispatch<SetStateAction<string | null>>;
}

export const PlayerContext = createContext<I_PlayerContext>({
  song_id: null,
  playlist: [],
  setSongId: () => {},
});

export const PlayerContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [songId, setSongId] = useState<string | null>(null);

  return (
    <PlayerContext.Provider
      value={{ song_id: songId, playlist: [], setSongId }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
