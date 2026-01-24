import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";

export async function POST() {
  await connectDB();

  try {
    // 1. 清空现有数据 (为了演示清晰)
    await Post.deleteMany({});
    await User.deleteMany({});

    // 2. 强制创建索引
    // 注意：Next.js 开发环境下 Mongoose 模型可能被缓存，导致 schema 更新未生效
    // 因此这里使用底层 createIndex 强制创建，确保 Text Index 一定存在
    await Post.collection.createIndex({ content: "text", author: "text" });
    // 其他标准索引交给 createIndexes
    await Post.createIndexes();
    await User.createIndexes();

    console.log("Indexes created successfully");

    // 3. 准备测试用户
    const user = await User.create({
      username: "mongo_expert",
      email: "expert@example.com",
      password: "password123"
    });

    // 4. 插入不同热度和内容的帖子
    // 注意：likes/dislikes 现在通过 likedBy/dislikedBy 数组计算，所以种子数据要改
    const posts = [
      {
        author: user.username,
        content: "学习 MongoDB 的 Aggregation Pipeline 非常重要，它是数据分析的神器。",
        likedBy: Array(120).fill("dummy_user"), // 模拟 120 人点赞 (使用假名)
        comments: [
            { content: "学到了！", author: "路人A", createdAt: new Date() },
            { content: "非常实用", author: "路人B", createdAt: new Date() }
        ]
      },
      {
        author: "nextjs_fan",
        content: "Next.js 14 server actions 结合 MongoDB 使用体验极佳。",
        likedBy: ["fan1", "fan2", "fan3", "fan4", "fan5"],
        comments: []
      },
      {
        author: "search_engine",
        content: "如何优化 MongoDB 的 $text 全文搜索性能？这是个好问题。",
        likedBy: Array(45).fill("search_lover"),
        comments: [{ content: "同问", author: "Jack", createdAt: new Date() }]
      },
      {
        author: "db_admin",
        content: "防止重复注册应该使用 Unique Index 唯一索引。",
        likedBy: Array(88).fill("db_user"),
        comments: [
            { content: "确实", author: "A", createdAt: new Date() },
            { content: "+1", author: "B", createdAt: new Date() },
            { content: "正解", author: "C", createdAt: new Date() }
        ]
      }
    ];

    await Post.insertMany(posts);

    return NextResponse.json({ 
      message: "Database seeded successfully! Indexes created and sample data added." 
    });

  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
