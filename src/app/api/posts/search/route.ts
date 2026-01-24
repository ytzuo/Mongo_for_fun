import { NextRequest, NextResponse } from "next/server";
import Post, { IPost } from "@/models/Post";
import connectDB from "@/lib/db";

export async function GET(request: NextRequest) {
    await connectDB();

    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q") || "";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        // 如果没有搜索关键词，返回空数组
        if (!query.trim()) {
            return NextResponse.json({ 
                posts: [], 
                total: 0, 
                page, 
                totalPages: 0 
            });
        }

        // 使用 MongoDB $text 操作符进行全文搜索
        // 注意：这需要在 Post 模型上建立文本索引 (PostSchema.index({ content: 'text', author: 'text' }))
        const filter = { $text: { $search: query } };

        // 获取符合条件的帖子数量
        const total = await Post.countDocuments(filter);
        
        // 查询帖子（按相关性分数排序，分页）
        const posts: IPost[] = await Post.find(
                filter,
                { score: { $meta: "textScore" } } // 投影出相关性分数
            )
            .sort({ score: { $meta: "textScore" } }) // 按相关性分数排序
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            posts,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            query
        });
    } catch (error: any) {
        console.error('Search error:', error);
        return NextResponse.json({ 
            error: "Failed to search posts" 
        }, { status: 500 });
    }
}