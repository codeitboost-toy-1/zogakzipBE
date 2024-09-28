import express from "express";
import {
  createComment,
  getCommentList,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// 댓글 등록
router.post("/posts/:postId/comments", createComment);

// 댓글 목록 조회
router.get("/posts/:postId/comments", getCommentList);

// 댓글 수정
router.put("/comments/:commentId", updateComment);

// 댓글 삭제
router.delete("/comments/:commentId", deleteComment);

export default router;
