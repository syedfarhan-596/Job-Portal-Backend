const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    requried: [true, "please provide title "],
  },
  company: {
    type: String,
    required: [true, "please provide company name"],
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
  publishedat: {
    type: Date,
    default: Date.now,
  },
  applicationdeadline: {
    type: Date,
    required: true,
  },
  postedby: {
    type: mongoose.Types.ObjectId,
  },
});

module.exports = mongoose.model("JobSchema", JobSchema);
