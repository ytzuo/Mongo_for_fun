import React from "react";
import { PostCard } from "@/components/PostCard";
import { Post } from "@/types";

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: "张三",
    content: "MongoDB 是一种面向文档的数据库管理系统，由 C++ 编写而成，旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。",
    createdAt: new Date("2024-03-10T09:00:00").toISOString(),
    likes: 12,
    dislikes: 1,
    comments: [
      {
        id: "c1",
        author: "李四",
        content: "确实很好用，特别是对于非结构化数据。",
        createdAt: new Date("2024-03-10T09:30:00").toISOString(),
      },
      {
        id: "c2",
        author: "王五",
        content: "学习曲线稍微有点陡，习惯了 SQL 之后需要转个弯。",
        createdAt: new Date("2024-03-10T10:15:00").toISOString(),
      },
    ],
  },
  {
    id: "2",
    author: "MongoDB 官方",
    content: "Next.js 配合 MongoDB 使用简直是绝配，Server Components 可以直接在服务端读取数据库，非常高效！\n\n大家觉得呢？",
    createdAt: new Date("2024-03-11T14:20:00").toISOString(),
    likes: 45,
    dislikes: 2,
    comments: [
      {
        id: "c3",
        author: "全栈开发者",
        content: "我也尝试过这个组合，部署在 Vercel 上也非常方便。",
        createdAt: new Date("2024-03-11T15:00:00").toISOString(),
      },
    ],
  },
  {
    id: "3",
    author: "新人小白",
    content: "求助：Mongoose 的 Schema 定义里，String 类型的 required 验证还是手动验证比较好？",
    createdAt: new Date("2024-03-12T11:05:00").toISOString(),
    likes: 3,
    dislikes: 0,
    comments: [],
  },
];

export default function Home() {
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

        <div className="space-y-6">
          {MOCK_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        
        <footer className="mt-12 text-center text-neutral-400 text-sm">
          <p>© 2026 MongoDB Demo Project</p>
        </footer>
      </div>
    </main>
  );
}
