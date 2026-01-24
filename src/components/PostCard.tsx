"use client";

import React, { useState } from "react";
import { Post, Comment } from "@/types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post: initialPost }: PostCardProps) {
  // 模拟本地状态，未来这些应该通过 API 与 MongoDB 交互
  const [likes, setLikes] = useState(initialPost.likes);
  const [dislikes, setDislikes] = useState(initialPost.dislikes);
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);

  const [comments, setComments] = useState<Comment[]>(initialPost.comments);
  const [newComment, setNewComment] = useState("");

  const handleVote = (type: "like" | "dislike") => {
    // 简单的投票逻辑模拟
    if (userVote === type) {
      // 取消投票
      if (type === "like") setLikes((prev) => prev - 1);
      else setDislikes((prev) => prev - 1);
      setUserVote(null);
    } else {
      // 切换投票或新投票
      if (userVote === "like") setLikes((prev) => prev - 1);
      if (userVote === "dislike") setDislikes((prev) => prev - 1);

      if (type === "like") setLikes((prev) => prev + 1);
      else setDislikes((prev) => prev + 1);
      setUserVote(type);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: "当前用户", // 模拟当前登录用户
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-6 transition-all hover:shadow-md">
      {/* 头部信息 */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
            {initialPost.author[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              {initialPost.author}
            </h3>
            <p className="text-xs text-neutral-500">
              {new Date(initialPost.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
          {initialPost.content}
        </p>
      </div>

      {/* 投票区域 */}
      <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-4">
        <button
          onClick={() => handleVote("like")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            userVote === "like"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
          <span>赞同 {likes}</span>
        </button>

        <button
          onClick={() => handleVote("dislike")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            userVote === "dislike"
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : "text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transform rotate-180" // 简单的反转大拇指
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
          <span>反对 {dislikes}</span>
        </button>
      </div>

      {/* 评论区域 */}
      <div className="p-4 border-t border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-3">
          评论 ({comments.length})
        </h4>

        {/* 评论列表 */}
        <div className="space-y-4 mb-4">
          {comments.length === 0 ? (
            <p className="text-sm text-neutral-400 italic">暂无评论，快来抢沙发...</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-300">
                  {comment.author[0]}
                </div>
                <div className="flex-1 bg-white dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm border border-neutral-100 dark:border-neutral-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {comment.author}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 添加评论 */}
        <form onSubmit={handleAddComment} className="flex gap-2 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的看法..."
            className="flex-1 px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-full text-sm font-medium transition-colors"
          >
            发送
          </button>
        </form>
      </div>
    </div>
  );
}
