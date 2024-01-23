const { AuthenticationError, BadRequestError } = require("../../erros");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const CompanyAuth = require("../../models/company/company");
const JobSchema = require("../../models/jobs/jobs");
const UserSchema = require("../../models/user/user");
const ApplySchema = require("../../models/apply/apply");

const ConversationSchema = require("../../models/conversation/conversation");
const MessageSchema = require("../../models/conversation/message");

const RegisterController = async (req, res) => {
  let { password, password2 } = req.body;
  if (password !== password2) {
    throw new BadRequestError("Password Mismatch ");
  }
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  const company = await CompanyAuth.create({
    ...req.body,
    password: newPassword,
  });
  const token = company.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: company.name }, token });
};

const LoginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AuthenticationError("Please provide email/password");
  }
  const company = await CompanyAuth.findOne({ email });
  if (!company) {
    throw new AuthenticationError(`No user with ${email} this email`);
  }

  const isPasswordCorrect = await company.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AuthenticationError(
      "Your password is incorrect please check and try again"
    );
  }
  const token = company.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: company.name }, token });
};

const GetController = async (req, res) => {
  const company = await CompanyAuth.findOne({ _id: req.user.companyId }).select(
    "-password"
  );

  res.status(StatusCodes.OK).json({ company });
};

const UpdateController = async (req, res) => {
  const companyId = req.user.companyId;
  if (req.file) {
    req.body.companyLogo = `localhost:4000/companylogo/${req.file.filename}`;
  }
  const company = await CompanyAuth.findByIdAndUpdate(companyId, req.body, {
    runValidators: true,
    new: true,
  }).select("-password");

  res.status(StatusCodes.OK).json({ msg: "Successfully updated", company });
};

const CreateJob = async (req, res) => {
  req.body.postedBy = req.user.companyId;
  req.body.company = req.user.name;

  const job = await JobSchema.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ msg: `Job ${job.title} Posted Successfully` });
};

const GetJobController = async (req, res) => {
  const { id } = req.params;
  const job = await JobSchema.findOne({ _id: id });

  if (!job) {
    throw new BadRequestError("No job found please double check id");
  }

  res.status(StatusCodes.OK).json({ job });
};

const UpdateJobController = async (req, res) => {
  const { id } = req.params;
  const job = await JobSchema.findOneAndUpdate({ _id: id }, req.body, {
    runValidators: true,
    new: true,
  }).select("-appliedby");
  if (!job) {
    throw new BadRequestError("No job found please correct your id");
  }
  res.status(StatusCodes.OK).json({ msg: "Successfully updated", job });
};

const AllPostedJobsController = async (req, res) => {
  const id = req.user.companyId;
  const jobs = await JobSchema.find({ postedBy: id });
  if (!jobs) {
    res
      .status(StatusCodes.OK)
      .json({ jobs: "You haven't not posted any jobs" });
  }
  const total = jobs.length;

  res.status(StatusCodes.OK).json({ jobs: jobs, total: total });
};

const GetAllAppliedUsers = async (req, res) => {
  const { education, skills, location, experience } = req.query;
  let QueryObject = {};
  if (education) {
    QueryObject.education = { $regex: education, $options: "i" };
  }
  if (skills && Array.isArray(skills)) {
    QueryObject.skills = { $in: skills.map((skill) => new RegExp(skill, "i")) };
  }
  if (location) {
    QueryObject.location = { $regex: location, $options: "i" };
  }
  if (experience) {
    QueryObject.experience = { $regex: experience, $options: "i" };
  }
  QueryObject.appliedCompanyId = req.user.companyId;
  const applications = await ApplySchema.find(QueryObject).sort("createdAt");
  if (!applications) {
    res.status(StatusCodes.OK).json({ application: "None" });
  }
  res
    .status(StatusCodes.OK)
    .json({ application: applications, total: applications.length });
};

const GetSingleJobAppliedUsers = async (req, res) => {
  const { id } = req.params;
  const { education, skills, location, experience } = req.query;
  let QueryObject = {};
  if (education) {
    QueryObject.education = { $regex: education, $options: "i" };
  }
  if (skills && Array.isArray(skills)) {
    QueryObject.skills = { $in: skills.map((skill) => new RegExp(skill, "i")) };
  }
  if (location) {
    QueryObject.location = { $regex: location, $options: "i" };
  }
  if (experience) {
    QueryObject.experience = { $regex: experience, $options: experience };
  }
  QueryObject.appliedJobId = id;
  const application = await ApplySchema.find(QueryObject);

  if (!application) {
    res.status(StatusCodes.OK).json({ application: "None" });
  }

  res
    .status(StatusCodes.OK)
    .json({ application: application, total: application.length });
};

// get one single user
const GetSingleUser = async (req, res) => {
  const { userId } = req.params;
  const user = await UserSchema.findOne({ _id: userId }).select(
    "username email profile"
  );
  if (!user) {
    throw new BadRequestError("Wrong ID please double check");
  }
  res.status(StatusCodes.OK).json({ user });
};

const DeleteJob = async (req, res) => {
  const { jobId } = req.params;
  const job = await JobSchema.findOneAndDelete({ _id: jobId });
  await ApplySchema.deleteMany({ appliedJobId: jobId });
  if (!job) {
    throw new BadRequestError("Invalid Job Id");
  }
  res.status(StatusCodes.OK).json({ msg: "Deleted Successfully" });
};

// create conversation or start conversation

const NewConversationController = async (req, res) => {
  const existingConversation = await ConversationSchema.findOne({
    members: { $all: [req.user.companyId, req.body.receiverId] },
  });

  if (!existingConversation) {
    const newConversation = await ConversationSchema.create({
      members: [req.user.companyId, req.body.receiverId],
    });

    res.status(StatusCodes.OK).json(newConversation);
  }
  res.status(StatusCodes.OK).json(existingConversation);
};

const GetConversationController = async (req, res) => {
  const conversations = await ConversationSchema.find({
    members: { $in: [req.user.companyId] },
  });
  const usersPromises = conversations.map(async (item) => {
    const userId = item.members.find((id) => id !== req.user.companyId);
    const user = await UserSchema.findById(userId).select("username email");
    return { ...user.toObject(), conversationId: item._id };
  });
  const conversationUsers = await Promise.all(usersPromises);

  res.status(StatusCodes.OK).json(conversationUsers);
};

//new message
const SendMessage = async (req, res) => {
  const newMessage = await MessageSchema.create(req.body);
  res.status(StatusCodes.OK).json(newMessage);
};

//get message
const GetMessages = async (req, res) => {
  const { conversationId } = req.params;
  const messages = await MessageSchema.find({ conversationId });
  res.status(StatusCodes.OK).json(messages);
};

module.exports = {
  RegisterController,
  LoginController,
  GetController,
  UpdateController,
  CreateJob,
  GetJobController,
  UpdateJobController,
  AllPostedJobsController,
  GetAllAppliedUsers,
  GetSingleJobAppliedUsers,
  GetSingleUser,
  NewConversationController,
  DeleteJob,
  GetConversationController,
  SendMessage,
  GetMessages,
};
