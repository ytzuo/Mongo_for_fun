import { NextRequest, NextResponse } from "next/server";
import Post, { IPost } from '@/models/Post';
import connectDB from '@/lib/db';

// 获取所有帖子
export async function GET(request: NextRequest) {
    await connectDB();
    try {
        const posts: IPost[] = await Post.find().sort({ createdAt: -1 }).lean().limit(20);
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

// 创建新帖子
export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const data = await request.json();
        const newPost = new Post({
            author: data.author,
            content: data.content,
            createdAt: new Date(),
            likes: 0,
            dislikes: 0,
            comments: []
        });
        const savedPost = await newPost.save();
        return NextResponse.json(savedPost, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}