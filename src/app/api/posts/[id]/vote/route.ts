import { NextRequest, NextResponse } from 'next/server';
import Post from '@/models/Post';
import connectDB from '@/lib/db';

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    await connectDB();

    try {
        const body = await request.json();
        const { type, username } = body; 

        if (!username) {
            return NextResponse.json({ error: "需登录后才能投票" }, { status: 401 });
        }

        const updateOps: any = {};

        if (type === "like") {
            // 如果点赞: 将用户加入 likedBy, 并从 dislikedBy 移除
            updateOps.$addToSet = { likedBy: username };
            updateOps.$pull = { dislikedBy: username };
        } else if (type === "dislike") {
            // 如果点踩
            updateOps.$addToSet = { dislikedBy: username };
            updateOps.$pull = { likedBy: username };
        } else {
             // 取消操作 (对应前端 userVote set to null)
             updateOps.$pull = { likedBy: username, dislikedBy: username };
        }
        
        console.log(`[Vote] User: ${username}, Type: ${type}, PostId: ${params.id}`);

        // 使用原子操作更新
        const updatedPost = await Post.findByIdAndUpdate(
            params.id,
            updateOps,
            { new: true }
        );

        console.log(`[Vote] Success. New Likes: ${updatedPost?.likes} (len: ${updatedPost?.likedBy?.length})`);

        if (!updatedPost) {
            return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
        }

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error("Vote error:", error);
        return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
    }
}