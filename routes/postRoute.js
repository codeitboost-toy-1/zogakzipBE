import express from "express";
import {
  createPost,
  getPostList,
  getPostDetail,
  updatePost,
  deletePost,
  verifyPostPassword,
  likePost,
  checkPostPublic,
} from "../controllers/postController.js";

const router = express.Router();

// 게시글 등록
router.post("/groups/:groupId/posts", createPost);

// 게시글 목록 조회
router.get("/groups/:groupId/posts", getPostList);

// 게시글 상세 조회
router.get("/posts/:postId", getPostDetail);

// 게시글 수정
router.put("/posts/:postId", updatePost);

// 게시글 삭제
router.delete("/posts/:postId", deletePost);

// 게시글 조회 권한 확인
router.post("/posts/:postId/verify-password", verifyPostPassword);

// 게시글 공감하기
router.post("/posts/:postId/like", likePost);

// 게시글 공개 여부 확인
router.get("/posts/:postId/is-public", checkPostPublic);

export default router;
