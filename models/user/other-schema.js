const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
  },
  basic: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    contact: {
      type: Number,
    },
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  skills: {
    type: [String],
    default: [],
  },
  education: [
    {
      degree: { type: String },
      institute: {
        type: String,
      },
      field: { type: String },
      start: { type: String },
      end: { type: String },
    },
  ],
  experience: [
    {
      position: { type: String },
      company: {
        type: String,
      },
      location: { type: String },
      start: { type: String },
      end: { type: String },
    },
  ],
  summary: {
    type: String,
  },
  resume: {
    type: String,
  },
});

const SavedJobSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  company: {
    type: String,
  },
  jobId: {
    type: mongoose.Types.ObjectId,
  },
  companyId: {
    type: mongoose.Types.ObjectId,
  },
});

module.exports = { SavedJobSchema, ProfileSchema };
