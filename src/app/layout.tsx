import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import PlayerNav from "@/components/AudioPlayer/PlayerNav";
import { ReactNode } from "react";
import PlayerContentLayout from "@/components/AudioPlayer/PlayerContentLayout";
import getCurrentUser from "@/auth/getCurrentUser";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Audio-Storage",
  description:
    "Your gateway to seamless audio storage, playback, and sharing. Experience a world of music like never before.",
};

const PlayerLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="grid min-h-screen w-full grid-cols-[1fr] lg:grid-cols-[240px_1fr]">
          <PlayerNav user={user}/>
          <PlayerContentLayout user={user}>{children}</PlayerContentLayout>
        </div>
      </body>
    </html>
  );
};

export default PlayerLayout;
