import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Types.ObjectId, ref: "Post", required: true }, // 게시글 참조
  nickname: { type: String, required: true },
  content: { type: String, required: true },
  password: { type: String, required: true }, // 댓글 비밀번호
  createdAt: { type: Date, default: Date.now }, // 댓글 생성일
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
