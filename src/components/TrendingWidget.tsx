import React from 'react';

export function TrendingWidget() {
  // 模拟数据 - 后续通过 MongoDB 聚合管道 ($aggregate) 从后端获取
  const trendingTopics = [
    { id: '1', title: '如何使用 MongoDB 唯一索引防止重复注册？', score: 980 },
    { id: '2', title: 'Next.js 16 Server Actions 实战技巧', score: 756 },
    { id: '3', title: '聚合管道：数据分析的神器', score: 542 },
    { id: '4', title: '文本搜索 $text 性能优化指南', score: 320 },
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5 sticky top-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 dark:border-neutral-700 pb-3">
        <span className="text-xl">🔥</span>
        <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
          热门话题
        </h3>
      </div>
      
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
                  热度 {topic.score}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-700 text-center">
        <p className="text-xs text-neutral-400 mb-2">
            排行榜演示
        </p>
        <span className="inline-block px-2 py-1 text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded">
            基于 MongoDB Aggregate 计算
        </span>
      </div>
    </div>
  );
}
