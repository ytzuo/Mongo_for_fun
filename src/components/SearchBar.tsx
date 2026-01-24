"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      router.push("/");
    } else {
      router.push(`/?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full mb-8">
      <input
        type="text"
        placeholder="搜索感兴趣的话题 (MongoDB 文本索引示例)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-2xl border-0 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
      />
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </form>
  );
}
