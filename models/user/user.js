//package imports

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  ProfileSchema,
  SavedJobSchema,
  PreferenceSchema,
} = require("./other-schema");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter name"],
      unique: true,
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
      required: [true, "please provide your email"],
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
    },

    profile: ProfileSchema,
    savedjobs: [SavedJobSchema],
    preferences: PreferenceSchema,
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this.id, name: this.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isPasswordValid = await bcrypt.compare(
    candidatePassword,
    this.password
  );
  return isPasswordValid;
};

module.exports = mongoose.model("UserSchema", UserSchema);
