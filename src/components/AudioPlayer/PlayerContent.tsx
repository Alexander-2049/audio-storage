"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export default function PlayerContent({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-auto">
        {children}
      </main>
    </QueryClientProvider>
  );
}
