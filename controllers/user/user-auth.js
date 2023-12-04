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
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
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

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
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
  if (req.file) {
    req.body.resume = `localhost:4000/resume/${req.file.filename}`;
  }
  const user = await UserAuth.findByIdAndUpdate(userId, req.body, {
    runValidators: true,
    new: true,
  }).select("-password");
  res.status(StatusCodes.OK).json({ msg: "Successfully updated", user });
};

//update sub details controller
// const UpdateSchemaController = async (req, res) => {
//   const { schema, id } = req.params;
//   const user = await UserAuth.findById(req.user.userId);
//   const update = user[schema].map((item) => item.id).indexOf(id);
//   if (update < 0) {
//     throw new BadRequestError("Wrong id Please double check");
//   }
//   user[schema][update].slice();
//   user.save();
//   res.status(StatusCodes.OK).json({ msg: "updated", user });
// };

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
