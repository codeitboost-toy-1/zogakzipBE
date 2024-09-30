import Post from "../models/Post.js";
import mongoose from "mongoose";
import { checkAndAwardBadges } from "./badgeService.js";

// 게시글 등록
export const createPostService = async (postData) => {
  const post = new Post(postData);

  // 게시글(추억) 저장
  const savedPost = await post.save();

  // 저장된 게시글이 포함된 그룹에 배지를 지급할 조건을 확인하고, 배지를 부여
  await checkAndAwardBadges(savedPost.groupId);

  return savedPost;
};

// 게시글 목록 조회
export const getPostListService = async ({
  groupId,
  page = 1,
  pageSize = 10,
  sortBy = "latest",
  keyword = "", // tag 기준으로 검색
  isPublic,
}) => {
  const sortOptions = {
    latest: { createdAt: -1 },
    mostCommented: { commentCount: -1 },
    mostLiked: { likeCount: -1 },
  };

  // 필터 정의 (태그를 기준으로 검색)
  const filter = {
    groupId,
    ...(isPublic !== undefined && { isPublic: isPublic === "true" }), // 공개 여부 필터
    ...(keyword && { tags: { $in: [new RegExp(keyword, "i")] } }), // 태그 필터
  };

  // 전체 게시글 수 계산
  const totalItemCount = await Post.countDocuments(filter);

  // 게시글 목록 조회 (페이지네이션 및 정렬 적용)
  const posts = await Post.find(filter)
    .sort(sortOptions[sortBy]) // 정렬
    .skip((page - 1) * pageSize) // 페이지네이션
    .limit(parseInt(pageSize));

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalItemCount / pageSize);

  // 결과 반환
  return {
    currentPage: parseInt(page),
    totalPages,
    totalItemCount,
    data: posts,
  };
};

// 게시글 상세 조회
export const getPostDetailService = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  return post;
};

// 게시글 수정
export const updatePostService = async (postId, password, updateData) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (post.postPassword !== password) throw new Error("Incorrect password");

  Object.assign(post, updateData); // 업데이트 데이터를 게시글에 병합
  return await post.save(); // 저장 후 반환
};

// 게시글 삭제
export const deletePostService = async (postId, password) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (post.postPassword !== password) throw new Error("Incorrect password");

  // post.remove() 대신 findByIdAndDelete() 사용
  await Post.findByIdAndDelete(postId);
};

// 게시글 조회 권한 확인
export const verifyPostPasswordService = async (postId, password) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (post.postPassword !== password) throw new Error("Incorrect password");
};

// 게시글 공감
export const likePostService = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  post.likeCount += 1;
  return await post.save();
};

// 게시글 공개 여부 확인
export const checkPostPublicService = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  return { id: post._id, isPublic: post.isPublic };
};
