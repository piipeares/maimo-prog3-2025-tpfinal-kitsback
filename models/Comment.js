import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    kitId: { type: mongoose.Schema.Types.ObjectId, ref: "Kit", required: true },
    author: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);