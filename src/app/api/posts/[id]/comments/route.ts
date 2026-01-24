import { NextRequest, NextResponse } from "next/server";
import Post, { IComment, IPost } from '@/models/Post';
import connectDB from '@/lib/db';

export async function POST(request: NextRequest, 
    { params }: { params: { id: string } }) {
    await connectDB();

    try {
        const body: { comment: string , auth: string } = await request.json();
        const newComment: IComment = {
            content: body.comment,
            author: body.auth || "匿名用户",
            createdAt: new Date()
        }

        // 使用 $push 操作符将新评论添加到指定帖子的 comments 数组中
        const updatedPost = await Post.findByIdAndUpdate(
            params.id,
            { $push: { comments: newComment } },
            { new: true }
        ).lean();

        if (!updatedPost) {
            return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
        }

        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}