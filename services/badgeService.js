// services/badgeService.js
import Group from "../models/Group.js";
import Badge from "../models/Badge.js";
import Post from "../models/Post.js";

export const checkAndAwardBadges = async (groupId) => {
  // 그룹을 찾고, 이미 배지가 있는지 확인
  const group = await Group.findById(groupId).populate("badges");

  if (!group) {
    console.error(`Group with ID ${groupId} not found`);
    return;
  }

  // 7일 연속 추억 등록 배지
  const sevenDayBadge = await Badge.findOne({ name: "7일 연속 추억 등록" });
  if (
    sevenDayBadge &&
    !group.badges.some((badge) => badge.name === "7일 연속 추억 등록")
  ) {
    const lastSevenDaysPosts = await Post.find({ groupId })
      .where("createdAt")
      .gte(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 지난 7일간의 추억 찾기

    const distinctDays = new Set(
      lastSevenDaysPosts.map((post) =>
        post.createdAt.toISOString().slice(0, 10)
      )
    ); // 날짜별로 추억 등록 여부 확인
    if (distinctDays.size >= 7) {
      group.badges.push(sevenDayBadge._id); // 배지 추가
      console.log(`Badge ${sevenDayBadge.name} added to group ${groupId}`);
    }
  }

  // 추억 20개 등록 배지
  const twentyPostsBadge = await Badge.findOne({ name: "추억 20개 등록" });
  if (
    twentyPostsBadge &&
    !group.badges.some((badge) => badge.name === "추억 20개 등록")
  ) {
    const postCount = await Post.countDocuments({ groupId });
    if (postCount >= 20) {
      group.badges.push(twentyPostsBadge._id);
      console.log(`Badge ${twentyPostsBadge.name} added to group ${groupId}`);
    }
  }

  // 1주년 기념 배지
  const oneYearBadge = await Badge.findOne({ name: "1주년 기념" });
  if (
    oneYearBadge &&
    !group.badges.some((badge) => badge.name === "1주년 기념")
  ) {
    const oneYearDate = new Date(
      group.created_at.getTime() + 365 * 24 * 60 * 60 * 1000
    ); // 1년 후 날짜 계산
    if (new Date() >= oneYearDate) {
      group.badges.push(oneYearBadge._id);
      console.log(`Badge ${oneYearBadge.name} added to group ${groupId}`);
    }
  }

  // 1만 그룹 공감 배지
  const tenThousandGroupLikesBadge = await Badge.findOne({
    name: "1만 그룹 공감",
  });
  if (
    tenThousandGroupLikesBadge &&
    !group.badges.some((badge) => badge.name === "1만 그룹 공감")
  ) {
    if (group.likes >= 10000) {
      // likeCount가 10,000 이상인지 확인
      group.badges.push(tenThousandGroupLikesBadge._id);
      console.log(
        `Badge ${tenThousandGroupLikesBadge.name} added to group ${groupId}`
      );
    }
  }

  // 1만 추억 공감 배지
  const tenThousandPostLikesBadge = await Badge.findOne({
    name: "1만 추억 공감",
  });

  // 배지가 이미 추가되지 않았는지 확인하고, likeCount가 10,000 이상인 게시글이 있는지 확인
  if (
    tenThousandPostLikesBadge &&
    !group.badges.some(
      (badgeId) =>
        badgeId.toString() === tenThousandPostLikesBadge._id.toString()
    )
  ) {
    // 해당 그룹의 게시글 중 likeCount가 10,000 이상인 게시글이 하나라도 있는지 확인
    const postsWithLikes = await Post.find({
      groupId,
      likeCount: { $gte: 10000 }, // likeCount가 10,000 이상인 게시글 찾기
    });

    console.log(`Found ${postsWithLikes.length} posts with 10,000+ likes`);

    if (postsWithLikes.length > 0) {
      group.badges.push(tenThousandPostLikesBadge._id); // 배지 추가
      console.log(
        `Badge ${tenThousandPostLikesBadge.name} added to group ${groupId}`
      );
    }
  }

  // 그룹 저장
  await group.save();
};
