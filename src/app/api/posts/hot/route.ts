import { NextRequest, NextResponse } from "next/server";
import Post, { IPost } from "@/models/Post";
import connectDB from "@/lib/db";

export async function GET(request: NextRequest) {
    await connectDB();

    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        /*
            相比于 find() 只是单纯地“把东西拿出来”，
            aggregate() 是在数据库内部“把东西加工好再给你”。
        */ 
        const hotPosts = await Post.aggregate([
            {
                $addFields: {
                    // 1. 计算评论数量 (防止 comments 为 null)
                    commentsCount: { $size: { $ifNull: ["$comments", []] } }
                }
            },
            {
                $addFields: {
                    // 2. 计算活跃度分数 = 点赞数 * 2 + 评论数 * 5
                    // 注意：现在 likes 是数组 likedBy 的长度，不能直接引用
                    activityScore: {
                        $add: [
                            { $multiply: [{ $size: { $ifNull: ["$likedBy", []] } }, 2] },
                            { $multiply: ["$commentsCount", 5] }
                        ]
                    },
                    // 为了让前端还是能拿到 likes 数字，我们需要手动计算并赋值，因为 Virtuals 在 aggregate 中不自动生效
                    likes: { $size: { $ifNull: ["$likedBy", []] } }
                }
            },
            {
                // 3. 按活跃度倒序排列
                $sort: { activityScore: -1 }
            },
            {
                // 4. 限制返回数量
                $limit: limit
            },
            {
                // 5. 投影：只返回需要的字段，去除笨重的 comments 数组内容
                $project: {
                    _id: 1,
                    content: 1,
                    author: 1,
                    likes: 1,
                    createdAt: 1,
                    commentsCount: 1,
                    activityScore: 1
                }
            }
        ]);

        return NextResponse.json(hotPosts);
    } catch (error) {
        console.error("Aggregation error:", error);
        return NextResponse.json({ error: "Failed to fetch hot posts" }, { status: 500 });
    }
}