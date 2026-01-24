"use client";

import React, { useState } from "react";
import { Post, Comment } from "@/types";
import { useUser } from "@/context/UserContext";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post: initialPost }: PostCardProps) {
  const { username } = useUser();
  // 使用初始数据初始化状态
  const [likes, setLikes] = useState(initialPost.likes);
  const [dislikes, setDislikes] = useState(initialPost.dislikes);
  // 初始化为 null
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);

  // 监听 username 变化，延迟同步初始投票状态
  // 这解决了页面刚加载时 username 为 null 导致状态判定错误的问题
  React.useEffect(() => {
    if (username) {
        if (initialPost.likedBy?.includes(username)) {
            setUserVote("like");
        } else if (initialPost.dislikedBy?.includes(username)) {
            setUserVote("dislike");
        }
    }
  }, [username, initialPost]);

  const [comments, setComments] = useState<Comment[]>(initialPost.comments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (type: "like" | "dislike") => {
    if (!username) {
        alert("请先设置昵称");
        return;
    }

    // 1. 乐观更新 (Optimistic UI Update)
    const previousUserVote = userVote;
    const previousLikes = likes;
    const previousDislikes = dislikes;

    let newLikes = likes;
    let newDislikes = dislikes;

    // 计算新的 UI 状态
    if (userVote === type) {
      // 当前已投这个票 -> 取消
      if (type === "like") newLikes--;
      else newDislikes--;
      setUserVote(null);
    } else {
      // 切换投票或新投票
      if (userVote === "like") newLikes--;      // 曾经赞过，现在要减掉
      if (userVote === "dislike") newDislikes--; // 曾经踩过，现在要减掉

      if (type === "like") newLikes++;
      else newDislikes++;
      setUserVote(type);
    }
    
    setLikes(newLikes);
    setDislikes(newDislikes);

    // 2. 发送 API 请求
    try {
      // 现在的 API 只需要传 type 和 username，后端会自动处理互斥逻辑
      // 如果是取消操作 (比如再次点击了赞)，不仅前端 userVote 设为 null，
      // 我们也传一个特殊的 type 或者在前端判断
      
      const isCancel = previousUserVote === type;
      // 如果 userVote 变成了 null (取消)，我们传 type="cancel" 给后端，或者复用原有 type 并在后端判断?
      // 为了简单，我们只发一次请求。
      
      const payloadType = isCancel ? "cancel" : type;

      const res = await fetch(`/api/posts/${initialPost.id}/vote`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
              type: payloadType, 
              username 
          }),
      });

      if (!res.ok) throw new Error("Vote failed");
      
    } catch (error) {
      console.error("Vote error:", error);
      // 3. 错误回滚
      setUserVote(previousUserVote);
      setLikes(previousLikes);
      setDislikes(previousDislikes);
      alert("投票失败，请重试");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${initialPost.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          author: username || "匿名马甲", 
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to post comment");
      }

      const savedComment: Comment = await res.json();

      setComments((prev) => [...prev, savedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Comment error:", error);
      alert("评论发表失败");
    } finally {
      setIsSubmitting(false);
    }
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
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 break-all">
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
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap break-words">
          {initialPost.content}
        </p>
      </div>

      {/* 投票区域 */}
      <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-4">
        <button
          onClick={() => handleVote("like")}
          disabled={isSubmitting} // 也可以选择在投票时不禁用，因为是乐观更新
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
          disabled={isSubmitting}
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
              // 使用 _id 作为后备 key，以防 id 虚拟字段因序列化问题丢失
              <div key={comment.id || (comment as any)._id} className="flex gap-3">
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
            disabled={isSubmitting}
            placeholder="写下你的看法..."
            className="flex-1 px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-full text-sm font-medium transition-colors"
          >
            {isSubmitting ? "发送中..." : "发送"}
          </button>
        </form>
      </div>
    </div>
  );
}
