import mongoose from "mongoose";

const kitSchema = new mongoose.Schema(
  {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: false },
    teamName: { type: String, default: "" },
    season: { type: String, required: true },
    type: { type: String, enum: ["home", "away", "third", "gk"], required: true },
    supplier: { type: String, required: true },
    sponsor: { type: String, default: "" },
    code: { type: String, default: "" },
    notes: { type: String, default: "" },
    tags: [{ type: String }],
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Kit = mongoose.model("Kit", kitSchema);

export default Kit;