"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function SeedButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    if (!confirm("确定要重置数据库吗？這将清除所有现有数据并创建索引。")) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert("初始化成功！索引已创建，测试数据已生成。");
        router.refresh(); // 刷新页面数据
        window.location.reload(); // 强制刷新以确保所有状态更新
      } else {
        alert("初始化失败: " + data.error);
      }
    } catch (error) {
      alert("请求出错");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="text-xs px-3 py-1.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors whitespace-nowrap ml-4"
    >
      {loading ? "正在重置..." : "🛠️ 初始化数据 & 索引"}
    </button>
  );
}
