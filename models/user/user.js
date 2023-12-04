//package imports

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const AddressSchema = new mongoose.Schema({
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  pincode: {
    type: Number,
  },
});
const EducationSchema = new mongoose.Schema({
  study: {
    type: String,
  },
  passing: {
    type: Date,
  },
  percentage: {
    type: Number,
  },
  board: {
    type: String,
  },
  medium: {
    type: String,
  },
});

const UserAuthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
      maxlength: 50,
      minlength: 3,
    },
    lastname: {
      type: String,
      required: [true, "Please enter Last Name"],
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minlength: 5,
    },
    preferedJob: {
      type: String,
    },
    education: EducationSchema,
    address: AddressSchema,
    preferedIndustry: {
      type: String,
    },
    preferedLocation: {
      type: String,
    },
    skills: [String],
    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserAuthSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this.id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserAuthSchema.methods.comparePassword = async function (candidatePassword) {
  const isPasswordValid = await bcrypt.compare(
    candidatePassword,
    this.password
  );
  return isPasswordValid;
};

module.exports = mongoose.model("UserAuth", UserAuthSchema);
