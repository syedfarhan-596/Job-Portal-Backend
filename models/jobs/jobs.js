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
      type: String,
      required: [true, "please provide location"],
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
    employmenttype: {
      type: String,
      required: true,
    },
    experiencelevel: {
      type: String,
      required: true,
    },
    educationlevel: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    applicationdeadline: {
      type: Date,
      required: true,
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobSchema", JobSchema);
