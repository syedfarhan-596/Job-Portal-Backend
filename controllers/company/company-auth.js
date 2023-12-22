const { AuthenticationError, BadRequestError } = require("../../erros");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const CompanyAuth = require("../../models/company/company");
const JobSchema = require("../../models/jobs/jobs");
const UserSchema = require("../../models/user/user");

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
  const company = await CompanyAuth.findByIdAndUpdate(companyId, req.body, {
    runValidators: true,
    new: true,
  }).select("-password");

  res.status(StatusCodes.OK).json({ msg: "Successfully updated", company });
};

const CreateJob = async (req, res) => {
  req.body.postedby = req.user.companyId;
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
  const jobs = await JobSchema.find({ postedby: id });
  if (!jobs) {
    res
      .status(StatusCodes.OK)
      .json({ jobs: "You haven't not posted any jobs" });
  }
  const total = jobs.length;
  res.status(StatusCodes.OK).json({ jobs: jobs, total: total });
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
};
