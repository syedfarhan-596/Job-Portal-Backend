const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      requried: [true, "please provide title "],
    },
    company: {
      type: String,
      required: [true, "please provide company name"],
    },
    companyDescription: {
      type: String,
    },
    industry: {
      type: String,
    },
    location: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "please provide location"],
    },
    jobType: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "please provide description"],
    },
    responsibilities: {
      type: [String],
      required: true,
    },
    qualifications: {
      type: [String],
    },

    skills: {
      type: [String],
      required: [true, "please provide skills"],
    },
    employmentType: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    educationLevel: {
      type: String,
      required: true,
    },
    minSalary: {
      type: Number,
      required: true,
    },
    maxSalary: {
      type: Number,
      required: true,
    },
    applicationDeadLine: {
      type: Date,
      default: new Date().setFullYear(),
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobSchema", JobSchema);
