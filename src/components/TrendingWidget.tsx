"use client";
import React, { useEffect, useState } from 'react';

export function TrendingWidget() {
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHotPosts() {
      try {
        const res = await fetch('/api/posts/hot?limit=5');
        if (res.ok) {
           const data = await res.json();
           // 数据适配：后端返回的是 Post 对象，我们需要显示 title/content
           setTrendingTopics(data.map((post: any) => ({
             id: post._id,
             title: post.content.length > 30 ? post.content.substring(0, 30) + '...' : post.content,
             score: post.activityScore
           })));
        }
      } catch (error) {
        console.error("Failed to fetch hot posts", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHotPosts();
  }, []);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5 sticky top-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 dark:border-neutral-700 pb-3">
        <span className="text-xl">🔥</span>
        <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
          热门话题
        </h3>
      </div>
      
      {loading ? (
        <div className="text-center text-sm text-neutral-400 py-4">加载中...</div>
      ) : trendingTopics.length === 0 ? (
        <div className="text-center text-sm text-neutral-400 py-4">暂无热门数据</div>
      ) : (
      <div className="space-y-4">
        {trendingTopics.map((topic, index) => (
          <div key={topic.id} className="group cursor-pointer">
            <div className="flex items-start gap-3">
              <span className={`
                flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-xs font-bold mt-0.5
                ${index === 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                  index === 1 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                  index === 2 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                  'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'}
              `}>
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 transition-colors line-clamp-2 break-words">
                  {topic.title}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  活跃度 {topic.score}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
      
      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-700 text-center">
        <p className="text-xs text-neutral-400 mb-2">
            排行榜 (基于聚合管道)
        </p>
        <span className="inline-block px-2 py-1 text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded">
            基于 MongoDB Aggregate 计算
        </span>
      </div>
    </div>
  );
}
