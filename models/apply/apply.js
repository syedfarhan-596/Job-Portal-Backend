const mongoose = require("mongoose");

const ApplySchema = new mongoose.Schema(
  {
    appliedby: {
      type: mongoose.Types.ObjectId,
    },

    appliedjob: {
      type: mongoose.Types.ObjectId,
    },
    appliedcompany: {
      type: mongoose.Types.ObjectId,
    },
    name: {
      type: String,
    },
    education: {
      type: String,
    },
    experience: {
      type: String,
    },
    levelofexperience: {
      type: Number,
    },
    skills: [String],
    description: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ApplySchema.index({ appliedby: 1, appliedjob: 1 }, { unique: true });

module.exports = mongoose.model("Apply", ApplySchema);
