//imports
const UserAuth = require("../../models/user/user");

const { AuthenticationError, BadRequestError } = require("../../erros");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const JobSchema = require("../../models/jobs/jobs");
const ApplySchema = require("../../models/apply/apply");

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

const GetAllJobs = async (req, res) => {
  const { name, location, skills } = req.query;
  const cacheKey = `jobs:${name || ""}:${location || ""}:${skills || ""}`;

  // Check if the results are already in the Redis cache
  // const cachedResults = await redisClient.get(cacheKey);
  // if (cachedResults) {
  //   const jobs = JSON.parse(cachedResults);
  //   return res
  //     .status(StatusCodes.OK)
  //     .json({ jobs, total: jobs.length, cached: true });
  // }

  //if not in cache then query the database
  let QueryObject = {};
  if (name) {
    QueryObject.title = { $regex: name, $options: "i" };
  }
  if (location) {
    QueryObject.location = { $regex: location, $options: "i" };
  }
  if (skills && Array.isArray(skills)) {
    QueryObject.skills = { $in: skills.map((skill) => new RegExp(skill, "i")) };
  }

  const jobs = await JobSchema.find(QueryObject);

  // redisClient.set(cacheKey, JSON.stringify(jobs), "EX", 3600);
  res.status(StatusCodes.OK).json({ jobs, total: jobs.length, cached: false });
};

//apply for jobs
const ApplyController = async (req, res) => {
  const { id } = req.params;
  req.body.appliedby = req.user.userId;
  req.body.appliedjob = id;
  const apply = await ApplySchema.create({ ...req.body });
  res.status(StatusCodes.OK).json(apply);
};

//save jobs
const SaveJobs = async (req, res) => {
  const { id } = req.params;

  req.body[0].jobId = id;
  const user = await UserAuth.findOne({ _id: req.user.userId });
  user.savedjobs.push({ ...req.body[0] });
  user.save();

  res.status(StatusCodes.OK).json({ msg: "Saved Successfullt" });
};

const DeleteSaveJobs = async (req, res) => {
  const { id } = req.params;
  let user = await UserAuth.findOne({ _id: req.user.userId });
  const indexOfSavedJob = user.savedjobs.map((item) => item.jobId).indexOf(id);
  user.savedjobs.splice(indexOfSavedJob, 1);
  user.save();
  res.status(StatusCodes.OK).json({ msg: "removed" });
};

//export modules
module.exports = {
  LoginController,
  RegisterController,
  UpdateController,
  GetContorller,
  GetAllJobs,
  ApplyController,
  SaveJobs,
  DeleteSaveJobs,
};
