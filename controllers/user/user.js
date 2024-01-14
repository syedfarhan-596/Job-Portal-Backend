const UserSchema = require("../../models/user/user");
const { AuthenticationError, BadRequestError } = require("../../erros");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const ApplySchema = require("../../models/apply/apply");
const ConversationSchema = require("../../models/conversation/conversation");
const MessageSchema = require("../../models/conversation/message");
const Company = require("../../models/company/company");
const JobSchema = require("../../models/jobs/jobs");

const UserLoginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email/password ");
  }
  const user = await UserSchema.findOne({ email });
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

const UserRegisterController = async (req, res) => {
  const { password, password2 } = req.body;
  if (password !== password2) {
    throw new AuthenticationError("Password Mismatch");
  }
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  const user = await UserSchema.create({ ...req.body, password: newPassword });
  const token = user.createJWT();

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.username }, token });
};

const UserUpdateProfileController = async (req, res) => {
  const userId = req.user.userId;
  req.body.user = req.user.userId;
  const {
    education,
    address,
    skills,
    basic,
    experience,
    summary,
    preferences,
  } = req.body;
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
  if (preferences) {
    updatedFields["preferences"] = {
      location: preferences.location,
      jobTitle: preferences.jobTitle,
    };
  }
  const user = await UserSchema.findOneAndUpdate(
    { _id: userId },
    { $set: updatedFields },
    { new: true, runValidators: true, select: "-password" }
  );
  if (!user) {
    throw new BadRequestError("No user found to update");
  }
  res.status(StatusCodes.OK).json({ msg: "Successfully updated" });
};

const UserGetController = async (req, res) => {
  const user = await UserSchema.findOne({ _id: req.user.userId }).select(
    "-password"
  );
  res.status(StatusCodes.OK).json({ user });
};

const UserGetAllJobs = async (req, res) => {
  const { name, location, skills } = req.query;

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
  const jobs = await JobSchema.find(QueryObject).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, total: jobs.length });
};

const UserSingleJobController = async (req, res) => {
  const { id } = req.params;
  const job = await JobSchema.findOne({ _id: id });
  if (!job) {
    throw new BadRequestError("No job with that id");
  }
  res.status(StatusCodes.OK).json(job);
};

const UserGetAllConversations = async (req, res) => {
  const conversations = await ConversationSchema.find({
    members: { $in: [req.user.userId] },
  });
  const usersPromises = conversations.map(async (item) => {
    const userId = item.members.find((id) => id !== req.user.userId);
    const user = await Company.findById(userId).select("name email");
    return { ...user.toObject(), conversationId: item._id };
  });
  const conversationUsers = await Promise.all(usersPromises);

  res.status(StatusCodes.OK).json(conversationUsers);
};

//new message
const UserSendMessage = async (req, res) => {
  const newMessage = await MessageSchema.create(req.body);
  res.status(StatusCodes.OK).json(newMessage);
};

//get message
const UserGetMessages = async (req, res) => {
  const { conversationId } = req.params;
  const messages = await MessageSchema.find({ conversationId });
  res.status(StatusCodes.OK).json(messages);
};

const UserSaveJob = async (req, res) => {
  const id = req.body.jobId;

  req.body.jobId = id;
  const user = await UserSchema.findOne({ _id: req.user.userId });
  user.savedjobs.push({ ...req.body });
  user.save();
  res.status(StatusCodes.OK).json({ msg: "Saved Successfully" });
};

const UserUnsaveJob = async (req, res) => {
  const { id } = req.params;
  let user = await UserSchema.findOne({ _id: req.user.userId });
  const indexOfSavedJob = user.savedjobs.map((item) => item.jobId).indexOf(id);
  user.savedjobs.splice(indexOfSavedJob, 1);
  user.save();
  res.status(StatusCodes.OK).json({ msg: "removed" });
};

const UserApplyController = async (req, res) => {
  const { companyId, jobId } = req.params;

  const apply = await ApplySchema.create({
    ...req.body,
    appliedByUserId: req.user.userId,
    appliedCompanyId: companyId,
    appliedJobId: jobId,
  });
  res.status(StatusCodes.OK).json({ msg: `Applied Successfully  ` });
};

const UserGetJobsById = async (req, res) => {
  const jobIds = req.body?.savedJobs?.map((item) => item.jobId);
  const jobs = await JobSchema.find({ _id: { $in: jobIds } });

  res.status(StatusCodes.OK).json(jobs);
};

const UserGetCompanies = async (req, res) => {
  const companies = await Company.find({}).select("-email -password ");
  res.status(StatusCodes.OK).json(companies);
};

const UserGetCompanyJobs = async (req, res) => {
  const jobs = await JobSchema.find({ postedBy: req.params.companyId });
  res.status(StatusCodes.OK).json(jobs);
};

module.exports = {
  UserLoginController,
  UserRegisterController,
  UserUpdateProfileController,
  UserSaveJob,
  UserGetAllJobs,
  UserGetController,
  UserSingleJobController,
  UserGetAllConversations,
  UserApplyController,
  UserUnsaveJob,
  UserGetMessages,
  UserSendMessage,
  UserGetJobsById,
  UserGetCompanies,
  UserGetCompanyJobs,
};
