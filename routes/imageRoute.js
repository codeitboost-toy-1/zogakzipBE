import express from "express";
import { uploadImage } from "../controllers/imageController.js";
import multer from "multer";

// Multer 설정 (이미지 파일을 서버 로컬에 저장)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 이미지를 저장할 폴더
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // 파일명 중복 방지를 위한 파일명 설정
  },
});

// 이미지 파일만 허용 (jpeg, png 등)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

// Multer 미들웨어 설정
const upload = multer({
  storage,
  fileFilter,
});

const router = express.Router();

// 이미지 업로드 API
router.post("/image", upload.single("image"), uploadImage);

// default export로 수정
export default router;
