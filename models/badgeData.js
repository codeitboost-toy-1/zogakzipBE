const badges = [
  {
    name: "7일 연속 추억 등록",
    description: "그룹에서 7일 연속으로 추억을 등록한 경우 획득",
    conditionType: "consecutiveDaysPosted",
    requiredValue: 7,
  },
  {
    name: "20개 이상의 추억 등록",
    description: "그룹에서 20개 이상의 추억을 등록한 경우 획득",
    conditionType: "postsCount",
    requiredValue: 20,
  },
  {
    name: "그룹 생성 후 1년 달성",
    description: "그룹 생성 후 1년이 지난 경우 획득",
    conditionType: "groupAge",
    requiredValue: 365,
  },
  {
    name: "그룹 공간 1만 개 이상 받기",
    description: "그룹 공간에서 1만 개 이상의 공감을 받은 경우 획득",
    conditionType: "groupLikes",
    requiredValue: 10000,
  },
  {
    name: "추억 공감 1만 개 이상 받기",
    description: "그룹의 추억 중 하나라도 1만 개 이상의 공감을 받은 경우 획득",
    conditionType: "postLikes",
    requiredValue: 10000,
  },
];

export default badges;
