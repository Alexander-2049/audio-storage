import { ReactNode } from "react";
import PlayerHeader from "./PlayerHeader";
import PlayerFooter from "./PlayerFooter";
import PlayerContent from "./PlayerContent";
import { IUser } from "@/server/database/user/User";

const PlayerContentLayout = ({
  children,
  user,
}: {
  children: ReactNode;
  user: IUser | null;
}) => {
  return (
    <div className="grid grid-rows-[60px_1fr_60px] h-screen">
      <PlayerHeader user={user} />
      <PlayerContent user={user}>{children}</PlayerContent>
      <PlayerFooter user={user} />
    </div>
  );
};

export default PlayerContentLayout;
