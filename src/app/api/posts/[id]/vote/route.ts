import { NextRequest, NextResponse } from 'next/server';
import Post, {IPost} from '@/models/Post';
import connectDB from '@/lib/db';

type VoteType = 'like' | 'dislike';
type VoteBody = { type : VoteType; value: 1 | -1  };

// 给帖子投票
export async function PATCH(request: NextRequest, 
    { params }: { params: { id: string } }) {
    await connectDB();

    try {
        const body: VoteBody = await request.json();
        const value = body.value;

        if (!['like', 'dislike'].includes(body.type) || ![1, -1].includes(value)) {
            return NextResponse.json({ error: "Invalid vote type or value" }, { status: 400 });
        }

        // inc 对象，可以在数据库层面对字段进行原子加减
        const incKey = body.type === 'like' ? 'likes' : 'dislikes';
        const update = { $inc: { [incKey]: value } };

        const updatedPost = await Post.findByIdAndUpdate(
            params.id,
            update,
            { new: true }
        ).lean();

        if (!updatedPost) {
            return NextResponse.json({ error: '帖子不存在' }, { status: 404 });
        }
        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json({ error: "Failed to vote on post" }, { status: 500 });
    }
}