"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";

export function CreatePostForm() {
  const router = useRouter();
  const { username } = useUser(); // 获取当前用户
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author: username, content }), // 使用 context 中的用户名
      });

      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      setContent("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("发布失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
        发布新话题
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm">
             {username?.[0]?.toUpperCase()}
           </div>
           <span className="text-neutral-600 dark:text-neutral-400 font-medium text-sm">
             正在以 <span className="text-neutral-900 dark:text-neutral-100 font-bold break-all">{username}</span> 的身份发布
           </span>
         </div>

        {/* 内容 */}
        <div>
           <label 
            htmlFor="content" 
            className="block text-base font-black text-neutral-900 dark:text-neutral-100 mb-2"
           >
            内容
           </label>
           <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            placeholder="分享您的想法、问题或见解..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-0 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all resize-none font-medium"
          />
        </div>

        {/* 发布按钮 */}
        <div className="flex justify-end pt-2">
            <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="group inline-flex items-center justify-center gap-2 px-12 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:bg-blue-400 whitespace-nowrap"
            >
            {isSubmitting ? (
            <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>发布中...</span>
            </>
            ) : (
                <span className="px-4">
                    <span>发布帖子</span>    
                </span>                                
            )}
            </button>
        </div>
      </form>
    </div>
  );
}
