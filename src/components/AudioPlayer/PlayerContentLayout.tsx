import { ReactNode } from "react";
import PlayerHeader from "./PlayerHeader";
import PlayerFooter from "./PlayerFooter";
import PlayerContent from "./PlayerContent";

const PlayerContentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid grid-rows-[60px_1fr_60px] h-screen">
      <PlayerHeader />
      <PlayerContent>{children}</PlayerContent>
      <PlayerFooter />
    </div>
  );
};

export default PlayerContentLayout;
