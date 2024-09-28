import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import groupRoutes from "./routes/groupRoute.js";
import postRoutes from "./routes/postRoute.js";
import commentRoutes from "./routes/commentRoute.js";

const app = express();
dotenv.config(); // .env 파일 로드

// CORS 설정
import cors from "cors";
app.use(cors());

// JSON 데이터 파싱 미들웨어 추가
app.use(express.json());

// MongoDB URI 가져오기
const mongoURI = process.env.DATABASE_URL;
mongoose.set("strictQuery", true);

// MongoDB 연결
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error);
    process.exit(1);
  });

// 라우트 설정
app.use("/api", groupRoutes); // 그룹 관련 API
app.use("/api", postRoutes); // 게시글 관련 API
app.use("/api", commentRoutes); // 댓글 관련 API

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
