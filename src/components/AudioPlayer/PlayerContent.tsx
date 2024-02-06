import { ReactNode } from "react";

export default function PlayerContent({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-auto">
      {children}
    </main>
  );
}
