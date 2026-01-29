import React from "react";
import { PostCard } from "@/components/PostCard";
import { CreatePostForm } from "@/components/CreatePostForm";
import { SearchBar } from "@/components/SearchBar";
import { TrendingWidget } from "@/components/TrendingWidget";
import { SeedButton } from "@/components/SeedButton"; // 引入新组件
import { UserProfile } from "@/components/UserProfile"; 
import connectDB from "@/lib/db";
import PostModel from "@/models/Post";

export const dynamic = 'force-dynamic';

async function getPosts(query?: string) {
  try {
    await connectDB();
    if (query) {
       // 全文搜索模式
       const filter = { $text: { $search: query } };
       const rawPosts = await PostModel.find(
          filter,
          { score: { $meta: "textScore" } }
       )
       .populate({ path: 'author', select: 'username' })
       .populate({ path: 'comments.author', select: 'username' })
       .sort({ score: { $meta: "textScore" } });
       
       return JSON.parse(JSON.stringify(rawPosts));
    } else {
       // 默认列表模式
       const rawPosts = await PostModel.find({})
         .populate({ path: 'author', select: 'username' })
         .populate({ path: 'comments.author', select: 'username' })
         .sort({ createdAt: -1 });
       return JSON.parse(JSON.stringify(rawPosts));
    }
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const posts = await getPosts(query);

  return (
    <main className="min-h-screen bg-neutral-100 dark:bg-neutral-950 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-row flex-wrap gap-8">
        
        {/* 左侧主要内容区域 (占大约 70%) */}
        <div className="flex-1 min-w-0" style={{ minWidth: '600px' }}>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                MongoDB 学习圈
              </h1>
            </div>
            <div className="flex justify-between items-start">
                <p className="text-neutral-500 dark:text-neutral-400 mb-6 flex-1">
                {query ? `正在显示 "${query}" 的搜索结果` : "这是一个基于 Next.js 和 MongoDB 的示例项目。在这里掌握 Unique Index, Text Search 和 Aggregation Pipeline。"}
                </p>
                <div className="flex items-center gap-4">
                  <UserProfile />
                  <SeedButton />
                </div>
            </div>
          </header>

          {/* 发布新帖子区域 */}
          {!query && <CreatePostForm />}

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
        </div>

        {/* 右侧侧边栏 (占大约 30%, 固定宽度) */}
        <div className="w-80 flex-shrink-0 space-y-6">
           {/* 搜索框放在右侧 */}
           <SearchBar />

           <TrendingWidget />
           
           {/* 学习小贴士 */}
           <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
              <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2 text-sm">如何实现左侧的搜索？</h4>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80 leading-relaxed">
                你需要为 Post Schema 的 content 字段创建 <strong>Text Index</strong>，然后使用 <code>$text</code> 操作符进行高效的全文检索。
              </p>
           </div>
        </div>

      </div>
        
        <footer className="mt-12 text-center text-neutral-400 text-sm">
          <p>© 2026 MongoDB Demo Project</p>
        </footer>
    </main>
  );
}
