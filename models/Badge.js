import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
});

const Badge = mongoose.model("Badge", badgeSchema);
export default Badge;
