// imports
const { StatusCodes } = require("http-status-codes");

//services import
const AuthService = require("../../services/user/user-auth");
const Userservices = require("../../services/user/user-services");
const UserJobs = require("../../services/user/user-jobs");

//user login
const UserLoginController = async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await AuthService.loginUser(email, password);
  res.status(StatusCodes.OK).json({ user: { name: user.username }, token });
};

//user register
const UserRegisterController = async (req, res) => {
  const { user, token } = await AuthService.registerUser(req.body);

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.username }, token });
};

//update user profile
const UserUpdateProfileController = async (req, res) => {
  const userId = req.user.userId;
  await Userservices.updateUser(userId, req.body, req.file);
  res.status(StatusCodes.OK).json({ msg: "Successfully updated" });
};

//get user details
const UserGetController = async (req, res) => {
  const { user } = await Userservices.getUser(req.user.userId);
  res.status(StatusCodes.OK).json({ user });
};

//get jobs with limit 10
const UserGetAllJobs = async (req, res) => {
  const queryData = req.query;
  const { jobs, count, params } = await UserJobs.getAllJobs(queryData);
  res.status(StatusCodes.OK).json({ jobs, count, params });
};

//get recommended jobs
const RecommendedJobs = async (req, res) => {
  const { user } = await Userservices.getUser(req.user.userId);
  const preferences = await UserJobs.getAllJobs({
    location: user?.preferences?.location,
    name: user?.preferences?.jobTitle,
  });
  const allJobs = await UserJobs.getAllJobs({});

  res.status(StatusCodes.OK).json({ allJobs, preferences });
};

//get single job
const UserSingleJobController = async (req, res) => {
  const { id } = req.params;
  const { job } = await UserJobs.getSingleJob(id);
  const { similarJob } = await UserJobs.getSimilarJob(id, job.industry);
  res.status(StatusCodes.OK).json({
    job,
    similarJob,
  });
};

//get user chats
const UserGetAllConversations = async (req, res) => {
  const id = req.user.userId;
  const { conversationUsers } = await Userservices.getConversaions(id);

  res.status(StatusCodes.OK).json(conversationUsers);
};

//new message
const UserSendMessage = async (req, res) => {
  const data = req.body;
  const { newMessage } = await Userservices.sendMessage(data);
  res.status(StatusCodes.OK).json(newMessage);
};

//get message
const UserGetMessages = async (req, res) => {
  const { conversationId } = req.params;
  const { messages } = await Userservices.getMessages(conversationId);
  res.status(StatusCodes.OK).json(messages);
};

//save job in user profile
const UserSaveJob = async (req, res) => {
  const id = req.body.jobId;
  const userId = req.user.userId;
  const data = req.body;
  const result = await Userservices.saveJob(id, userId, data);
  res.status(StatusCodes.OK).json(result);
};

//unsave a job from profile
const UserUnsaveJob = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const result = await Userservices.unSaveJob(id, userId);
  res.status(StatusCodes.OK).json(result);
};

//apply for a job
const UserApplyController = async (req, res) => {
  const { companyId, jobId } = req.params;
  const userId = req.user.userId;
  const result = await Userservices.applyJob(
    companyId,
    userId,
    jobId,
    req.body
  );
  res.status(StatusCodes.OK).json(result);
};

//get applicaitons
const UserGetApplications = async (req, res) => {
  const { applications } = await Userservices.applications(req.user.userId);
  res.status(StatusCodes.OK).json({ applications });
};

//to get jobs which are in saved
const UserGetJobsById = async (req, res) => {
  const data = req.body;
  const { jobs } = await UserJobs.getJobsByIds(data);
  res.status(StatusCodes.OK).json({ jobs });
};

//get companies
const UserGetCompanies = async (req, res) => {
  const queryData = req.query;
  const { companies, count } = await Userservices.getCompanies(queryData);
  res.status(StatusCodes.OK).json({ companies, count });
};

//get jobs from a specific company
const UserGetCompanyJobs = async (req, res) => {
  const queryData = req.query;
  const companyId = req.params.companyId;
  const { jobs, count } = await UserJobs.getCompanyJobs(queryData, companyId);
  res.status(StatusCodes.OK).json({ jobs, count });
};

//get single company
const UserGetSingleCompany = async (req, res) => {
  const companyId = req.params.companyId;
  const { company } = await Userservices.getCompany(companyId);
  const { similarCompany } = await Userservices.getSimilarCompany(
    companyId,
    company.industry
  );
  res.status(StatusCodes.OK).json({ company, similarCompany });
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
  UserGetSingleCompany,
  UserGetApplications,
  RecommendedJobs,
};
