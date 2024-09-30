import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  is_public: { type: Boolean, default: true },
  password: { type: String },
  created_at: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },

  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge", default: [] }], // badges 기본값으로 빈 배열 설정
});

const Group = mongoose.model("Group", groupSchema);
export default Group;
