"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PlayerSearch = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const pathname = usePathname();
  const [isSearchPageOpen, setIsSearchPageOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === "/search" && !isSearchPageOpen) {
      setIsSearchPageOpen(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else if (pathname !== "/search" && isSearchPageOpen) {
      setIsSearchPageOpen(false);
      setValue("");
    } else if (pathname !== "/search" && !isSearchPageOpen && value !== "") {
      router.push("/search?" + new URLSearchParams({ q: value }).toString());
    }
  }, [pathname, isSearchPageOpen, router, value]);

  useEffect(() => {
    if (isSearchPageOpen) {
      router.push("/search?" + new URLSearchParams({ q: value }).toString());
    }
  }, [value, router, isSearchPageOpen]);

  useEffect(() => {
    if (!searchParams.get("q")) {
      setValue("");
    }
  }, [searchParams]);

  return (
    <Input
      className="bg-white shadow-none appearance-none pl-8 dark:bg-gray-950"
      placeholder="Search songs, albums, artists..."
      type="search"
      value={value}
      onChange={(e) => {
        setValue(e.currentTarget.value);
      }}
      ref={inputRef}
    />
  );
};

export default PlayerSearch;
