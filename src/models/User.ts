// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// 1. 定义 IUser 接口
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  id: string; // 虚拟字段
}

// 2. Schema 不变
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true }, // 移除 unique: true，允许昵称重复
  email: { type: String, required: true, unique: true }, // 仅邮箱保持唯一
  password: { type: String, required: true }
}, { timestamps: true });

// 3. 模型导出（防 HMR 重复）
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
