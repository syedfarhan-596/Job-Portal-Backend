const mongoose = require("mongoose");

const ApplySchema = new mongoose.Schema(
  {
    appliedByUserId: {
      type: mongoose.Types.ObjectId,
    },

    appliedJobId: {
      type: mongoose.Types.ObjectId,
    },
    appliedCompanyId: {
      type: mongoose.Types.ObjectId,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    education: {
      type: String,
    },
    experience: {
      type: String,
    },
    experienceTime: {
      type: Number,
    },
    skills: [String],

    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ApplySchema.index({ appliedByUserId: 1, appliedJobId: 1 }, { unique: true });

module.exports = mongoose.model("ApplySchema", ApplySchema);
