import express from "express";

const app = express();

// 라우트 정의
app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(3000, () => console.log("Server Started"));
