import {
  createPostService,
  getPostListService,
  getPostDetailService,
  updatePostService,
  deletePostService,
  verifyPostPasswordService,
  likePostService,
  checkPostPublicService,
} from "../services/postService.js";

// 게시글 등록
export const createPost = async (req, res) => {
  try {
    // URL 파라미터로 전달된 groupId
    const groupId = req.params.groupId;

    // Request body로부터 필요한 데이터 추출
    const {
      nickname,
      title,
      content,
      postPassword,
      imageUrl,
      tags,
      location,
      moment,
      isPublic,
    } = req.body;

    // 필수 필드가 누락된 경우 400 에러 반환
    if (!groupId || !nickname || !title || !content || !postPassword) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 게시글 생성 서비스 호출
    const savedPost = await createPostService({
      groupId,
      nickname,
      title,
      content,
      imageUrl,
      tags,
      location,
      moment,
      isPublic,
      postPassword,
    });

    // 필요한 필드만 추출해서 응답으로 보냅니다.
    const responseData = {
      id: savedPost._id,
      groupId: savedPost.groupId,
      nickname: savedPost.nickname,
      title: savedPost.title,
      content: savedPost.content,
      imageUrl: savedPost.imageUrl,
      tags: savedPost.tags,
      location: savedPost.location,
      moment: savedPost.moment,
      isPublic: savedPost.isPublic,
      likeCount: savedPost.likeCount || 0, // 기본값 0
      commentCount: savedPost.commentCount || 0, // 기본값 0
      createdAt: savedPost.createdAt,
    };

    res.status(200).json(responseData); // 성공 시 응답 반환
  } catch (error) {
    console.error(`Error creating post: ${error.message}`); // 에러 로그 추가
    res.status(400).json({ message: "잘못된 요청입니다" });
  }
};

// 게시글 목록 조회
export const getPostList = async (req, res) => {
  try {
    const { page, pageSize, sortBy, keyword, isPublic } = req.query; // 쿼리 파라미터
    const groupId = req.params.groupId; // 그룹 ID 파라미터

    // 서비스 호출
    const postsData = await getPostListService({
      groupId,
      page,
      pageSize,
      sortBy,
      keyword,
      isPublic,
    });

    // 응답 형식 맞춰서 데이터 가공
    const responseData = {
      currentPage: postsData.currentPage,
      totalPages: postsData.totalPages,
      totalItemCount: postsData.totalItemCount,
      data: postsData.data.map((post) => ({
        id: post._id,
        nickname: post.nickname,
        title: post.title,
        imageUrl: post.imageUrl,
        tags: post.tags,
        location: post.location,
        moment: post.moment,
        isPublic: post.isPublic,
        likeCount: post.likeCount || 0, // 기본값 0
        commentCount: post.commentCount || 0, // 기본값 0
        createdAt: post.createdAt,
      })),
    };

    res.status(200).json(responseData); // 성공 시 데이터 반환
  } catch (error) {
    console.error("Error fetching post list:", error.message);
    res.status(400).json({ message: "잘못된 요청입니다" });
  }
};

// 게시글 상세 조회
export const getPostDetail = async (req, res) => {
  try {
    const postId = req.params.postId;

    // 게시글 상세 조회 서비스 호출
    const post = await getPostDetailService(postId);

    // 응답 형식에 맞춰서 데이터 가공
    const responseData = {
      id: post._id,
      groupId: post.groupId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      tags: post.tags,
      location: post.location,
      moment: post.moment,
      isPublic: post.isPublic,
      likeCount: post.likeCount || 0, // 기본값 0
      commentCount: post.commentCount || 0, // 기본값 0
      createdAt: post.createdAt,
    };

    res.status(200).json(responseData); // 성공 시 데이터 반환
  } catch (error) {
    res.status(404).json({ message: "존재하지 않습니다" });
  }
};

// 게시글 수정
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { postPassword } = req.body;

    // 게시글 수정 서비스 호출
    const updatedPost = await updatePostService(postId, postPassword, req.body);

    // 수정된 게시글 데이터 가공
    const responseData = {
      id: updatedPost._id,
      groupId: updatedPost.groupId,
      nickname: updatedPost.nickname,
      title: updatedPost.title,
      content: updatedPost.content,
      imageUrl: updatedPost.imageUrl,
      tags: updatedPost.tags,
      location: updatedPost.location,
      moment: updatedPost.moment,
      isPublic: updatedPost.isPublic,
      likeCount: updatedPost.likeCount || 0, // 기본값 0
      commentCount: updatedPost.commentCount || 0, // 기본값 0
      createdAt: updatedPost.createdAt,
    };

    res.status(200).json(responseData); // 성공 시 데이터 반환
  } catch (error) {
    if (error.message === "Incorrect password") {
      res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    } else if (error.message === "Post not found") {
      res.status(404).json({ message: "존재하지 않습니다" });
    } else {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  }
};

// 게시글 삭제
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { postPassword } = req.body; // body에서 postPassword 추출

    if (!postPassword) {
      return res.status(400).json({ message: "비밀번호가 필요합니다" });
    }

    await deletePostService(postId, postPassword); // 서비스 호출
    res.status(200).json({ message: "게시글 삭제 성공" });
  } catch (error) {
    if (error.message === "Incorrect password") {
      res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    } else if (error.message === "Post not found") {
      res.status(404).json({ message: "존재하지 않습니다" });
    } else {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  }
};

// 게시글 조회 권한 확인
export const verifyPostPassword = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { password } = req.body;
    await verifyPostPasswordService(postId, password);
    res.status(200).json({ message: "비밀번호가 확인되었습니다" });
  } catch (error) {
    res.status(401).json({ message: "비밀번호가 틀렸습니다" });
  }
};

// 게시글 공감
export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    await likePostService(postId);
    res.status(200).json({ message: "게시글 공감하기 성공" });
  } catch (error) {
    res.status(404).json({ message: "존재하지 않습니다" });
  }
};

// 게시글 공개 여부 확인
export const checkPostPublic = async (req, res) => {
  try {
    const postId = req.params.postId;
    const result = await checkPostPublicService(postId);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: "존재하지 않습니다" });
  }
};
