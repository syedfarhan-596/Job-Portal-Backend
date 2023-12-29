const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide name"],
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "please provide email"],
      minlength: 3,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please provide password"],
      minlength: 5,
    },
    description: {
      type: String,
      required: [true, "please Provide company description"],
    },
    industry: {
      type: String,
      required: [true, "please provide industry"],
    },
    location: {
      type: String,
      required: [true, "please provide location"],
    },
  },
  { timestamps: true }
);

CompanySchema.methods.createJWT = function () {
  return jwt.sign(
    { companyId: this.id, name: this.name },
    process.env.JWT_COMPANY,
    { expiresIn: process.env.JWT_CMPLIFE }
  );
};

CompanySchema.methods.comparePassword = async function (candidatePassword) {
  const isPasswordCorrect = await bcrypt.compare(
    candidatePassword,
    this.password
  );
  return isPasswordCorrect;
};

module.exports = mongoose.model("Company", CompanySchema);
