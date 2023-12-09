//imports
const UserAuth = require("../../models/user/user");

const { AuthenticationError, BadRequestError } = require("../../erros");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const JobSchema = require("../../models/jobs/jobs");

//login controller
const LoginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email/password ");
  }
  const user = await UserAuth.findOne({ email });
  if (!user) {
    throw new AuthenticationError(`No user with ${email} this email`);
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AuthenticationError("Invalid Email/Password, Please try again");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.username }, token });
};

//register controller
const RegisterController = async (req, res) => {
  const { password, password2 } = req.body;
  if (password !== password2) {
    throw new AuthenticationError("Password Mismatch");
  }
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  const user = await UserAuth.create({ ...req.body, password: newPassword });
  const token = user.createJWT();

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.username }, token });
};

//get user
const GetContorller = async (req, res) => {
  const user = await UserAuth.findOne({ _id: req.user.userId }).select(
    "-password"
  );
  res.status(StatusCodes.OK).json({ user });
};

//update profile controller
const UpdateController = async (req, res) => {
  const userId = req.user.userId;
  req.body.user = req.user.userId;
  const { education, address, skills, basic, experience, summary } = req.body;
  const updatedFields = {};
  if (req.file) {
    updatedFields[
      "profile.resume"
    ] = `localhost:4000/resume/${req.file.filename}`;
  }
  if (education) {
    updatedFields["profile.education"] = education;
  }
  if (basic) {
    updatedFields["profile.basic"] = basic;
  }
  if (address) {
    updatedFields["profile.address"] = address;
  }
  if (skills) {
    updatedFields["profile.skills"] = skills;
  }
  if (experience) {
    updatedFields["profile.experience"] = experience;
  }
  if (summary) {
    updatedFields["profile.summary"] = summary;
  }
  const user = await UserAuth.findOneAndUpdate(
    { _id: userId },
    { $set: updatedFields },
    { new: true, runValidators: true, select: "-password" }
  );
  if (!user) {
    throw new BadRequestError("No user found to update");
  }
  res.status(StatusCodes.OK).json({ msg: "Successfully updated" });
};

//get jobs

//apply for jobs
const ApplyController = async (req, res) => {
  const { id } = req.params;
  req.body.appliedby = req.user.userId;
  req.body.name = req.user.name;
  const job = await JobSchema.findOne({ _id: id });
  job.appliedby.push({ ...req.body });
  job.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "applied successfully", job: job.title });
};

//export modules
module.exports = {
  LoginController,
  RegisterController,
  UpdateController,
  GetContorller,
  ApplyController,
};
