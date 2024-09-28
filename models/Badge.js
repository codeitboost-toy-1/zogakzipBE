import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 배지 이름
  description: { type: String, required: true }, // 배지 설명
  conditionType: { type: String, required: true }, // 배지 획득 조건 유형 (e.g., daysPosted, postsCount, ...)
  requiredValue: { type: Number, required: true }, // 조건 달성 기준 값
});

export default mongoose.model("Badge", badgeSchema);
