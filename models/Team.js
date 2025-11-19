const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    type: { type: String, enum: ["club", "national"], default: "club" },
    crestUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);