const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  appliedby: {
    type: mongoose.Types.ObjectId,
  },
  name: {
    type: String,
    required: [true, "please provide name"],
  },
  location: {
    type: String,
    required: [true, "please provide location"],
  },
  description: {
    type: String,
    required: [true, "please provide description"],
  },
  skills: [String],
});

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    requried: [true, "please provide title "],
  },
  description: {
    type: String,
    required: [true, "please provide description"],
  },
  opening: {
    type: String,
    requried: [true, "Please provide number of opening"],
  },
  position: {
    type: String,
    required: [true, "please provide position"],
  },
  role: {
    type: String,
    required: [true, "please provide role"],
  },
  requirement: [String],
  package: {
    type: String,
    requried: [true, "please provide package "],
  },
  postedby: {
    type: mongoose.Types.ObjectId,
  },
  companyname: {
    type: String,
    required: [true, "please provide company name"],
  },
  appliedby: [ApplicationSchema],
});

module.exports = mongoose.model("JobSchema", JobSchema);
