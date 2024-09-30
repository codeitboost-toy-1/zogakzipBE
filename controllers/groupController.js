import {
  createGroupService,
  getGroupListService,
  updateGroupService,
  deleteGroupService,
  getGroupDetailService,
  verifyPasswordService,
  likeGroupService,
  checkPublicService,
} from "../services/groupService.js";
import mongoose from "mongoose";

// 그룹 등록
export const createGroup = async (req, res) => {
  try {
    const { name, password, imageUrl, isPublic, introduction } = req.body;
    const group = await createGroupService({
      name,
      password,
      imageUrl,
      isPublic,
      introduction,
    });

    const response = {
      id: group._id,
      name: group.name,
      imageUrl: group.image,
      isPublic: group.is_public,
      likeCount: group.likes,
      badges: [], // 배지가 없는 상태에서 빈 배열로 반환
      postCount: group.posts_count,
      createdAt: group.created_at,
      introduction: group.description,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: "잘못된 요청입니다" });
  }
};

// 그룹 목록 조회
export const getGroupList = async (req, res) => {
  try {
    const { page, pageSize, sortBy, keyword, isPublic } = req.query;
    const groupList = await getGroupListService({
      page,
      pageSize,
      sortBy,
      keyword,
      isPublic,
    });
    res.status(200).json(groupList);
  } catch (error) {
    res.status(400).json({ message: "잘못된 요청입니다" });
  }
};

// 그룹 수정
export const updateGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { name, password, imageUrl, isPublic, introduction } = req.body;
    const updatedGroup = await updateGroupService(groupId, password, {
      name,
      imageUrl,
      isPublic,
      introduction,
    });

    const response = {
      id: updatedGroup._id,
      name: updatedGroup.name,
      imageUrl: updatedGroup.image,
      isPublic: updatedGroup.is_public,
      likeCount: updatedGroup.likes,
      badges: [], // 배지가 없는 상태에서 빈 배열로 반환
      postCount: updatedGroup.posts_count,
      createdAt: updatedGroup.created_at,
      introduction: updatedGroup.description,
    };

    res.status(200).json(response);
  } catch (error) {
    if (error.message === "Incorrect password") {
      res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    } else if (error.message === "Group not found") {
      res.status(404).json({ message: "존재하지 않습니다" });
    } else {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  }
};

// 그룹 삭제
export const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId; // URL에서 groupId를 가져옵니다.
    console.log("Deleting group with ID:", groupId); // 그룹 ID 확인

    const { password } = req.body; // request body에서 password를 가져옵니다.

    if (!password) {
      return res.status(400).json({ message: "비밀번호가 필요합니다" });
    }

    await deleteGroupService(groupId, password); // 서비스 호출
    res.status(200).json({ message: "그룹 삭제 성공" });
  } catch (error) {
    console.error("Error:", error.message); // 오류 메시지 출력
    if (error.message === "Incorrect password") {
      res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    } else if (error.message === "Group not found") {
      res.status(404).json({ message: "존재하지 않습니다" });
    } else {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  }
};

// 그룹 상세 조회
export const getGroupDetail = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    console.log(`Group ID requested: ${groupId}`); // 그룹 ID 로그 추가

    // 서비스에서 그룹 정보를 가져옵니다.
    const group = await getGroupDetailService(groupId);

    if (!group) {
      console.error(`Group with ID ${groupId} not found`); // 에러 로그 추가
      return res.status(404).json({ message: "Group not found" });
    }

    // 응답 데이터 형식을 맞추어 전송합니다.
    const response = {
      id: group.id,
      name: group.name,
      imageUrl: group.image,
      isPublic: group.is_public,
      likeCount: group.likes,
      badges: group.badges,
      postCount: group.posts_count,
      createdAt: group.created_at,
      introduction: group.description,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(
      `Error fetching group details for ID ${req.params.groupId}: ${error.message}`
    ); // 에러 메시지 로그 추가
    res
      .status(400)
      .json({ message: "잘못된 요청입니다", error: error.message });
  }
};

// 그룹 조회 권한 확인
export const verifyPassword = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { password } = req.body;
    await verifyPasswordService(groupId, password);
    res.status(200).json({ message: "비밀번호가 확인되었습니다" });
  } catch (error) {
    res.status(401).json({ message: "비밀번호가 틀렸습니다" });
  }
};

// 그룹 공감하기
export const likeGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    await likeGroupService(groupId);
    res.status(200).json({ message: "그룹 공감하기 성공" });
  } catch (error) {
    res.status(404).json({ message: "존재하지 않습니다" });
  }
};

// 그룹 공개 여부 확인
export const checkPublic = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const result = await checkPublicService(groupId);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: "존재하지 않습니다" });
  }
};
