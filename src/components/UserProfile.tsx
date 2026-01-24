"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

export function UserProfile() {
  const { username, logout } = useUser();

  if (!username) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-xs text-neutral-500 mb-0.5">已登录</p>
        <p className="font-bold text-neutral-800 dark:text-neutral-200">
          @{username}
        </p>
      </div>
      <button
        onClick={() => {
          if (confirm("确定要退出吗？")) {
            logout();
          }
        }}
        className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
      >
        退出
      </button>
    </div>
  );
}
