import React from "react";
import { PostCard } from "@/components/PostCard";
import { CreatePostForm } from "@/components/CreatePostForm";
import connectDB from "@/lib/db";
import PostModel from "@/models/Post";

export const dynamic = 'force-dynamic';

async function getPosts() {
  try {
    await connectDB();
    const rawPosts = await PostModel.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(rawPosts));
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-neutral-100 dark:bg-neutral-950 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              MongoDB 学习圈
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400">
            这是一个基于 Next.js 和 MongoDB 的示例项目。
            <br />
            你可以在这里发表观点，进行投票互动。
          </p>
        </header>

        {/* 发布新帖子区域 */}
        <CreatePostForm />

        {/* 帖子列表区域 */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <p className="text-neutral-500 dark:text-neutral-400">
                暂无帖子，快来抢占沙发吧！
              </p>
            </div>
          )}
        </div>
        
        <footer className="mt-12 text-center text-neutral-400 text-sm">
          <p>© 2026 MongoDB Demo Project</p>
        </footer>
      </div>
    </main>
  );
}
