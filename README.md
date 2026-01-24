不知道为什么**突然**对nosql有了兴趣
然后就写了这个用MongoDB的Demo
就当玩玩了，如果有心情就继续学学然后更新一下

本项目通过三个具体的业务场景来演示 MongoDB 的功能：

1.  **用户注册 & 数据完整性** (Data Integrity)
    *   使用 **Unique Index** (唯一索引) 确保 `email` 不重复。
    *   演示了如何捕获并优雅处理 MongoDB 的底层错误码 `E11000`。
    *   实现了在 Schema 变更时（如移除用户名的唯一性）的索引管理。

2.  **全文搜索** (Full-Text Search)
    *   使用 **Text Index** (文本索引) 和 `$text` 操作符实现高效的帖子搜索。
    *   支持模糊查询，并利用 `$meta: "textScore"` 提取相关性分数，让最匹配的结果排在前面。

3.  **热门话题排行榜** (Data Analysis)
    *   使用强大的 **Aggregation Pipeline** (聚合管道) 进行数据分析。
    *   通过 `$addFields`, `$group`, `$sort` 等阶段，动态计算帖子的“活跃度” (点赞数 x 2 + 评论数 x 5) 并生成即时热榜。
  
## 🛠️ 技术栈

*   **框架**: Next.js 15+ (App Router, Server Actions)
*   **数据库**: MongoDB
*   **ORM**: Mongoose
*   **语言**: TypeScript
*   **样式**: Tailwind CSS