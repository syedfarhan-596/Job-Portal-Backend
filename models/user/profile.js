const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
  },
  basic: {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    contact: {
      type: String,
    },
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalcode: { type: String },
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

module.exports = ProfileSchema;
