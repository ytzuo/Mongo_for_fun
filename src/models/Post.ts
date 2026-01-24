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
  // likes: number; // 废弃
  // dislikes: number; // 废弃
  likedBy: string[]; // 存储用户 ID 或 username
  dislikedBy: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
  id: string; // 虚拟字段
  likes: number; // 虚拟字段
  dislikes: number; // 虚拟字段
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
}, {
  toJSON: { virtuals: true }
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
    // 将计数器替换为数组
    likedBy: {
        type: [String],
        default: []
    },
    dislikedBy: {
        type: [String],
        default: []
    },
    /*
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
    */
    // 嵌入 CommentSchema 数组
    comments: [CommentSchema], 
  },
  {
    // Mongoose 选项
    timestamps: true, // 自动管理 createdAt 和 updatedAt 字段
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true }
  }
);

// 定义虚拟字段 likes 和 dislikes
PostSchema.virtual('likes').get(function() {
    return this.likedBy ? this.likedBy.length : 0;
});

PostSchema.virtual('dislikes').get(function() {
    return this.dislikedBy ? this.dislikedBy.length : 0;
});

// 为全文搜索创建索引
PostSchema.index({ content: "text", author: "text" });

// 3. 导出模型
// 注意：在 Next.js 开发模式下，热更新可能导致 Model 缓存不一致。
// 为了确保 Schema 修改生效 (如添加 likedBy)，我们可以尝试在非生产环境下重置 Model
if (process.env.NODE_ENV !== 'production') {
    delete mongoose.models.Post;
}

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
