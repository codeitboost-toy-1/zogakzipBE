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
    const groupId = req.params.groupId; // URL에서 groupId를 가져옵니다.
    const post = await createPostService({ ...req.body, groupId }); // body와 함께 groupId를 전달합니다
    res.status(200).json(post);
  } catch (error) {
    console.error("Error creating post:", error.message); // 오류 메시지 출력
    res.status(400).json({ message: "잘못된 요청입니다" });
  }
};

// 게시글 목록 조회
export const getPostList = async (req, res) => {
  try {
    const { page, pageSize, sortBy, keyword, isPublic } = req.query; // 쿼리 파라미터
    const groupId = req.params.groupId; // 그룹 ID 파라미터

    const posts = await getPostListService({
      groupId,
      page,
      pageSize,
      sortBy,
      keyword,
      isPublic,
    });
    res.status(200).json(posts); // 성공 시 데이터 반환
  } catch (error) {
    console.error("Error fetching post list:", error.message);
    res.status(400).json({ message: "잘못된 요청입니다" });
  }
};

// 게시글 상세 조회
export const getPostDetail = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await getPostDetailService(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: "존재하지 않습니다" });
  }
};

// 게시글 수정
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { postPassword } = req.body;
    const updatedPost = await updatePostService(postId, postPassword, req.body);
    res.status(200).json(updatedPost);
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
// 게시글 삭제 Controller
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
