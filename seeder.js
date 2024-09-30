// seeder.js
import Badge from "./models/Badge.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.DATABASE_URL;
mongoose
  .connect(mongoURI, {
    // useNewUrlParser: true, // 더 이상 필요 없음
    // useUnifiedTopology: true // 더 이상 필요 없음
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error);
    process.exit(1);
  });

const badges = [
  {
    name: "7일 연속 추억 등록",
    description: "7일 연속으로 추억을 등록 완료.",
    condition: "7일 동안 매일 추억을 등록",
  },
  {
    name: "추억 20개 등록",
    description: "20개 이상의 추억을 등록 완료.",
    condition: "그룹 내 추억 20개 이상 등록",
  },
  {
    name: "1주년 기념",
    description: "그룹이 1년을 맞이했습니다.",
    condition: "그룹 생성 후 1년 경과",
  },
  {
    name: "1만 그룹 공감",
    description: "1만 개 이상의 그룹 공감 달성.",
    condition: "그룹 공감 10,000개 이상 받기",
  },
  {
    name: "1만 추억 공감",
    description: "1만 개 이상의 추억 공감 달성.",
    condition: "추억 공감 10,000개 이상 받기.",
  },
];

Badge.insertMany(badges)
  .then(() => {
    console.log("Badges seeded");
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("Error seeding badges:", error);
    mongoose.disconnect();
  });
