"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SEARCH_INPUT_THROTTLE = 500;

const InputSearch = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const pathname = usePathname();
  const [isSearchPageOpen, setIsSearchPageOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const delayedSearch = useRef<number | null>(null); // Hold the timeout ID

  useEffect(() => {
    if (
      pathname === "/search" &&
      searchParams.get("q") !== "" &&
      !isSearchPageOpen
    ) {
      setValue(searchParams.get("q") || "");
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
  }, [pathname, isSearchPageOpen, router, value, searchParams]);

  useEffect(() => {
    if (!searchParams.get("q")) {
      setValue("");
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setValue(val);
    if (delayedSearch.current !== null) {
      clearTimeout(delayedSearch.current);
    }
    delayedSearch.current = window.setTimeout(() => {
      if (val !== "") {
        router.push("/search?" + new URLSearchParams({ q: val }).toString());
      }
    }, SEARCH_INPUT_THROTTLE);
  };

  return (
    <Input
      className="bg-white shadow-none appearance-none pl-8 dark:bg-gray-950"
      placeholder="Search songs, albums, artists..."
      type="search"
      value={value}
      onChange={handleChange}
      ref={inputRef}
    />
  );
};

export default InputSearch;
