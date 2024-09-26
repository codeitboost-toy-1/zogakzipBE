import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

const app = express();
dotenv.config(); // 환경 변수 로드
// 라우트 정의
app.get("/", (req, res) => {
  res.send("Hello");
});

// mongodb 연결
const mongoURI = process.env.DATABASE_URL; // 환경 변수에서 DB URL을 가져옴

mongoose.set("strictQuery", true);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error);
    process.exit(1); // 연결 실패 시 프로세스 종료
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
