import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  is_public: { type: Boolean, default: true },
  password: { type: String },
  created_at: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  badges_count: { type: Number, default: 0 },
  posts_count: { type: Number, default: 0 },
});

const Group = mongoose.model("Group", groupSchema);
export default Group;
