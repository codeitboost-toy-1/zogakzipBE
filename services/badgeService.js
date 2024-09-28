import Group from "../models/Group.js";
import Badge from "../models/Badge.js";

export const checkBadgeCriteria = async (groupId) => {
  const group = await Group.findById(groupId).populate("posts");

  // 배지 조건 확인 로직
  const badgesToAward = [];

  // 7일 연속 추억 등록 배지 확인
  const last7DaysPosts = group.posts.filter((post) => {
    const postDate = new Date(post.createdAt);
    const diffDays = (new Date() - postDate) / (1000 * 3600 * 24);
    return diffDays <= 7;
  });

  if (last7DaysPosts.length >= 7) {
    const badge = await Badge.findOne({
      conditionType: "consecutiveDaysPosted",
    });
    if (!group.badges.includes(badge._id)) badgesToAward.push(badge);
  }

  // 20개 이상의 추억 등록 배지 확인
  if (group.posts.length >= 20) {
    const badge = await Badge.findOne({ conditionType: "postsCount" });
    if (!group.badges.includes(badge._id)) badgesToAward.push(badge);
  }

  // 그룹 생성 후 1년 달성 배지 확인
  const daysSinceCreation =
    (new Date() - new Date(group.createdAt)) / (1000 * 3600 * 24);
  if (daysSinceCreation >= 365) {
    const badge = await Badge.findOne({ conditionType: "groupAge" });
    if (!group.badges.includes(badge._id)) badgesToAward.push(badge);
  }

  // 그룹 공감 1만 개 이상 배지 확인
  if (group.likes >= 10000) {
    const badge = await Badge.findOne({ conditionType: "groupLikes" });
    if (!group.badges.includes(badge._id)) badgesToAward.push(badge);
  }

  // 추억 공감 1만 개 이상 배지 확인
  const hasPostWith10kLikes = group.posts.some(
    (post) => post.likeCount >= 10000
  );
  if (hasPostWith10kLikes) {
    const badge = await Badge.findOne({ conditionType: "postLikes" });
    if (!group.badges.includes(badge._id)) badgesToAward.push(badge);
  }

  // 그룹에 배지 추가
  if (badgesToAward.length > 0) {
    group.badges.push(...badgesToAward.map((badge) => badge._id));
    await group.save();
  }

  return badgesToAward;
};
