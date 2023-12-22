const mongoose = require("mongoose");

const ApplySchema = new mongoose.Schema(
  {
    appliedby: {
      type: mongoose.Types.ObjectId,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    skills: [String],
    appliedjob: {
      type: mongoose.Types.ObjectId,
    },
    appliedcompany: {
      type: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

ApplySchema.index({ appliedby: 1, appliedjob: 1 }, { unique: true });

module.exports = mongoose.model("Apply", ApplySchema);
