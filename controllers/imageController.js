export const uploadImage = (req, res) => {
  try {
    // 이미지 파일이 제대로 업로드되었는지 확인
    if (!req.file) {
      return res.status(400).json({ message: "이미지 파일이 필요합니다" });
    }

    // 이미지 URL을 반환
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "이미지 업로드에 실패했습니다" });
  }
};
