import { Database_User } from "@/server/database/user/User";
import { ReactNode } from "react";

export default function PlayerContent({
  children,
  user,
}: {
  children: ReactNode;
  user: Database_User | null;
}) {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-auto">
      {children}
    </main>
  );
}
