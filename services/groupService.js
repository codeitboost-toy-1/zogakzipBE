import Group from "../models/Group.js";
import Post from "../models/Post.js";
import mongoose from "mongoose";

// 그룹 등록
export const createGroupService = async (data) => {
  const newGroup = new Group({
    name: data.name,
    password: data.password,
    image: data.imageUrl,
    is_public: data.isPublic,
    description: data.introduction,
    likes: 0,
    badges_count: 0,
    posts_count: 0,
    created_at: new Date(),
  });
  return await newGroup.save();
};

// 그룹 목록 조회
export const getGroupListService = async ({
  page = 1,
  pageSize = 10,
  sortBy = "latest",
  keyword = "",
  isPublic,
}) => {
  const filter = {
    ...(isPublic && { is_public: isPublic === "true" }), // 공개 여부 필터
    ...(keyword && { name: new RegExp(keyword, "i") }), // 검색어 필터
  };

  const sortOptions = {
    latest: { created_at: -1 },
    mostPosted: { posts_count: -1 },
    mostLiked: { likes: -1 },
    mostBadge: { badges_count: -1 },
  };

  const totalItemCount = await Group.countDocuments(filter);
  const groups = await Group.find(filter)
    .sort(sortOptions[sortBy])
    .skip((page - 1) * pageSize)
    .limit(parseInt(pageSize));

  return {
    currentPage: page,
    totalPages: Math.ceil(totalItemCount / pageSize),
    totalItemCount,
    data: groups.map((group) => ({
      id: group._id,
      name: group.name,
      imageUrl: group.image,
      isPublic: group.is_public,
      likeCount: group.likes,
      badgeCount: group.badges_count,
      postCount: group.posts_count,
      createdAt: group.created_at,
      introduction: group.description,
    })),
  };
};

// 그룹 수정
export const updateGroupService = async (groupId, password, updatedData) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");
  if (group.password !== password) throw new Error("Incorrect password");

  group.name = updatedData.name;
  group.image = updatedData.imageUrl;
  group.is_public = updatedData.isPublic;
  group.description = updatedData.introduction;

  return await group.save();
};

// 그룹 삭제
export const deleteGroupService = async (groupId, password) => {
  // groupId가 ObjectId 형식인지 확인
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    throw new Error("Group not found"); // 유효하지 않은 ID 형식일 경우 404 처리
  }

  // groupId를 ObjectId로 변환하여 그룹 검색
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found"); // 그룹이 없으면 404 처리
  if (group.password !== password) throw new Error("Incorrect password"); // 비밀번호가 일치하지 않으면 403 처리

  // 그룹 내 게시글 모두 삭제
  await Post.deleteMany({ groupId: group._id });

  // 그룹 삭제 (remove 대신 deleteOne 또는 findByIdAndDelete 사용)
  await Group.findByIdAndDelete(groupId);

  console.log(`Group ${groupId} and its posts have been deleted.`);

  return; // 삭제 완료
};

// 그룹 상세 조회
export const getGroupDetailService = async (groupId) => {
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    throw new Error("Invalid group ID format"); // 그룹 ID 형식이 잘못되었을 때 에러 발생
  }

  const group = await Group.findById(groupId).populate("badges"); // populate를 사용해 badges 참조 데이터 가져오기
  if (!group) {
    throw new Error("Group not found");
  }

  return {
    id: group._id,
    name: group.name,
    image: group.image,
    is_public: group.is_public,
    likes: group.likes,
    badges: group.badges.map((badge) => ({
      name: badge.name,
      description: badge.description,
      iconUrl: badge.iconUrl,
      createAt: badge.createAt,
    })), // badge 정보를 구성
    posts_count: group.posts_count,
    created_at: group.created_at,
    description: group.description,
  };
};

// 그룹 조회 권한 확인
export const verifyPasswordService = async (groupId, password) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");
  if (group.password !== password) throw new Error("Incorrect password");
};

// 그룹 공감하기
export const likeGroupService = async (groupId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");
  group.likes += 1;
  return await group.save();
};

// 그룹 공개 여부 확인
export const checkPublicService = async (groupId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");
  return {
    id: group._id,
    isPublic: group.is_public,
  };
};
