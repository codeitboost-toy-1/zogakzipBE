import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  groupId: { type: mongoose.Types.ObjectId, ref: "Group", required: true }, // 그룹 ID
  nickname: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  postPassword: { type: String, required: true }, // 게시글 비밀번호
  imageUrl: { type: String },
  tags: [{ type: String }], // 태그 배열
  location: { type: String },
  moment: { type: Date, required: true }, // 추억의 순간
  isPublic: { type: Boolean, default: true }, // 공개 여부
  likeCount: { type: Number, default: 0 }, // 공감 수
  commentCount: { type: Number, default: 0 }, // 댓글 수
  createdAt: { type: Date, default: Date.now }, // 생성일
});

const Post = mongoose.model("Post", postSchema);

export default Post;
