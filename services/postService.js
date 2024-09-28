import Post from "../models/Post.js";
import mongoose from "mongoose";

// 게시글 등록
export const createPostService = async (data) => {
  const newPost = new Post({
    groupId: data.groupId,
    nickname: data.nickname,
    title: data.title,
    content: data.content,
    postPassword: data.postPassword,
    imageUrl: data.imageUrl,
    tags: data.tags,
    location: data.location,
    moment: data.moment,
    isPublic: data.isPublic,
  });

  return await newPost.save();
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

  // groupId를 문자열로 비교 (만약 MongoDB에 string으로 저장되어 있다면)
  const filter = {
    groupId: groupId, // ObjectId 대신 문자열로 비교
    ...(isPublic !== undefined && { isPublic: isPublic === "true" }), // Boolean 값으로 처리
    ...(keyword && { tags: { $regex: keyword, $options: "i" } }), // tags 필드에 keyword 포함 필터
  };

  console.log("Applied Filter:", filter); // 필터 로그

  const totalItemCount = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .sort(sortOptions[sortBy])
    .skip((page - 1) * pageSize)
    .limit(parseInt(pageSize));

  console.log("Posts:", posts); // 쿼리 결과 확인

  return {
    currentPage: page,
    totalPages: Math.ceil(totalItemCount / pageSize),
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

  Object.assign(post, updateData);
  return await post.save();
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
