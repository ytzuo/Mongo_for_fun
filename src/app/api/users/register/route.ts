import { NextRequest, NextResponse } from 'next/server';
import User, { IUser } from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const body: Partial<IUser> = await request.json();

        // 基本验证
        if (!body.username || !body.email || !body.password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        // 检查用户是否已存在
        const existingUser = await User.findOne({ 
            $or: [ { username: body.username }, { email: body.email } ] 
        }).lean();
        if (existingUser) {
            return NextResponse.json({ error: "User alreadyexists" }, { status: 409 });
        }

        // 创建新用户
        const newUser = new User({
            username: body.username,
            email: body.email,
            password: body.password // 注意：实际应用中应对密码进行哈希处理
        });
        const savedUser = await newUser.save();
        return NextResponse.json(savedUser, { status: 201 });
    } catch (error: any) {
        // 检测 MongoDB 重复键错误 (E11000)
        if (error.code === 11000) {
            return NextResponse.json({ 
                error: "User already exists", 
                field: Object.keys(error.keyPattern)[0] 
            }, { status: 409 });
        }
        console.error('Registration error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}