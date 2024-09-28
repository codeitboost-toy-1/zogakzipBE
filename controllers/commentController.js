import {
  createCommentService,
  getCommentListService,
  updateCommentService,
  deleteCommentService,
} from "../services/commentService.js";

// 댓글 등록
export const createComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { nickname, content, password } = req.body;

    const comment = await createCommentService(postId, {
      nickname,
      content,
      password,
    });

    // 필요한 필드만 추출해서 응답으로 보냅니다.
    const responseData = {
      id: comment._id, // MongoDB에서 생성된 _id 필드를 id로 반환
      nickname: comment.nickname,
      content: comment.content,
      createdAt: comment.createdAt,
    };

    res.status(200).json(responseData); // 응답에 필요한 필드만 반환
  } catch (error) {
    res.status(400).json({ message: "잘못된 요청입니다" });
  }
};

// 댓글 목록 조회
export const getCommentList = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { page = 1, pageSize = 10 } = req.query; // 기본값 설정

    const comments = await getCommentListService(postId, page, pageSize);

    // 필요한 필드만 추출해서 응답으로 보냅니다.
    const responseData = {
      currentPage: comments.currentPage,
      totalPages: comments.totalPages,
      totalItemCount: comments.totalItemCount,
      data: comments.data.map((comment) => ({
        id: comment._id, // MongoDB에서 _id를 id로 변환
        nickname: comment.nickname,
        content: comment.content,
        createdAt: comment.createdAt,
      })),
    };

    res.status(200).json(responseData); // 응답 반환
  } catch (error) {
    res.status(400).json({ message: "잘못된 요청입니다" });
  }
};

// 댓글 수정
export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { nickname, content, password } = req.body;

    // 댓글 수정 서비스 호출
    const updatedComment = await updateCommentService(commentId, password, {
      nickname,
      content,
    });

    // 필요한 필드만 추출해서 응답으로 보냅니다.
    const responseData = {
      id: updatedComment._id, // MongoDB에서 _id를 id로 변환
      nickname: updatedComment.nickname,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt,
    };

    res.status(200).json(responseData); // 수정된 댓글 데이터를 응답으로 반환
  } catch (error) {
    if (error.message === "Incorrect password") {
      res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    } else if (error.message === "Comment not found") {
      res.status(404).json({ message: "존재하지 않습니다" });
    } else {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  }
};

// 댓글 삭제
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { password } = req.body;
    await deleteCommentService(commentId, password);
    res.status(200).json({ message: "댓글 삭제 성공" });
  } catch (error) {
    if (error.message === "Incorrect password") {
      res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    } else if (error.message === "Comment not found") {
      res.status(404).json({ message: "존재하지 않습니다" });
    } else {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  }
};
