import mongoose, { Schema, Document, Model } from "mongoose";

// 定义 Comment 的接口（对应 Typescript 类型）
export interface IComment {
  content: string;
  author: string;
  createdAt: Date;
}

// 定义 Post 的接口
export interface IPost extends Document {
  author: string;
  content: string;
  likes: number;
  dislikes: number;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
  id: string; // 虚拟字段
}

// 1. 定义 Comment Schema (作为嵌入文档)
const CommentSchema = new Schema<IComment>({
  content: { 
    type: String, 
    required: [true, "评论内容不能为空"], // 添加简单的验证及其错误信息
    trim: true 
  },
  author: { 
    type: String, 
    required: true,
    default: "匿名用户" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 2. 定义 Post Schema
const PostSchema = new Schema<IPost>(
  {
    author: { 
      type: String, 
      required: [true, "作者不能为空"] 
    },
    content: { 
      type: String, 
      required: [true, "内容不能为空"] 
    },
    likes: { 
      type: Number, 
      default: 0,
      min: 0 // 简单的数值验证
    },
    dislikes: { 
      type: Number, 
      default: 0,
      min: 0
    },
    // 嵌入 CommentSchema 数组
    comments: [CommentSchema], 
  },
  {
    // Mongoose 选项
    timestamps: true, // 自动管理 createdAt 和 updatedAt 字段
    toJSON: { virtuals: true, versionKey: false }    
  }
);

// 3. 导出模型
// 注意：在 Next.js 中，为了防止热更新导致的 "OverwriteModelError"，
// 我们需要检查 mongoose.models 是否已经存在该模型
const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
