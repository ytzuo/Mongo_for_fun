import { NextRequest, NextResponse } from "next/server";
import Post, { IComment, IPost } from '@/models/Post';
import connectDB from '@/lib/db';

export async function POST(request: NextRequest, 
    props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    await connectDB();

    try {
        const body = await request.json(); // 注意：这里 body 结构需要跟前端匹配
        // 前端传的是 { content, author }
        const newComment: IComment = {
            content: body.content,
            author: body.author || "匿名用户",
            createdAt: new Date()
        }

        // 方式二：先查询文档，利用 Mongoose 的数组操作方法 push，保存后获取完整的子文档（包含自动生成的 _id）
        const post = await Post.findById(params.id);
        
        if (!post) {
            return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
        }

        // 构造新评论
        const newCommentData = {
            content: body.content,
            author: body.author, // 这里应该是 UserId
            createdAt: new Date()
        };

        // 添加到评论数组
        post.comments.push(newCommentData as any);
        
        // 保存更改
        const savedPost = await post.save();
        
        // 必须充填作者信息，否则前端拿到的只是 ObjectId
        await savedPost.populate('comments.author', 'username');

        // 获取刚刚保存的评论
        const savedComment = savedPost.comments[savedPost.comments.length - 1];

        // 只返回新创建的评论，而不是整个 Post
        return NextResponse.json(savedComment);
    } catch (error) {
        console.error("Add comment error:", error);
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}