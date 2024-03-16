import { ReactNode } from "react";
import PlayerHeader from "./PlayerHeader";
import PlayerFooter from "./PlayerFooter";
import PlayerContent from "./PlayerContent";
import { Database_User } from "@/server/database/user/User";

const PlayerContentLayout = ({
  children,
  user,
}: {
  children: ReactNode;
  user: Database_User | null;
}) => {
  return (
    <div className="grid grid-rows-[60px_1fr_60px] h-screen">
      <PlayerHeader user={user} />
      <PlayerContent>{children}</PlayerContent>
      <PlayerFooter />
    </div>
  );
};

export default PlayerContentLayout;
