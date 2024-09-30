// models/Badge.js
import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 배지 이름
  description: { type: String, required: true }, // 배지 설명
  condition: { type: String, required: true }, // 조건 (예: '7일 연속', 등)
  iconUrl: { type: String }, // 배지 아이콘 URL
  createdAt: { type: Date, default: Date.now }, // 배지 생성일
});

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;
