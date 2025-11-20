import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    type: { type: String, enum: ["club", "national"], default: "club" },
    logo: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);