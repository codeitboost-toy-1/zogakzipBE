import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

const app = express();
dotenv.config(); // .env 파일 로드

// MongoDB URI 가져오기
const mongoURI = process.env.DATABASE_URL;
mongoose.set("strictQuery", true);

// 라우트 정의
app.get("/", (req, res) => {
  res.send("Hello");
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
