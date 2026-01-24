"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";

export function UserLoginModal() {
  const { username, login } = useUser();
  const [inputName, setInputName] = useState("");
  const [error, setError] = useState("");

  // 如果已有用户名，不显示模态框
  if (username) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = inputName.trim();
    
    if (!name) {
      setError("昵称不能为空");
      return;
    }

    if (name.length > 10) {
      setError("昵称不能超过10个字符");
      return;
    }

    // 这里可以添加调用后端注册接口的逻辑
    // await fetch('/api/users', ...)
    
    login(name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold mb-4">
            Hi
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            欢迎加入圈子
          </h2>
          <p className="text-neutral-500 mt-2 text-sm">
            给自己起个响亮的马甲吧，无需注册
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={inputName}
              onChange={(e) => {
                setInputName(e.target.value);
                setError("");
              }}
              placeholder="请输入你的昵称"
              className="w-full px-5 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputName.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30"
          >
            立即进入
          </button>
        </form>
      </div>
    </div>
  );
}
