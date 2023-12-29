const UserSchema = require("../../models/user/user");

const { StatusCodes } = require("http-status-codes");

const SaveJobs = async (req, res) => {
  const { id } = req.params;

  req.body.jobId = id;
  const user = await UserSchema.findOne({ _id: req.user.userId });
  user.savedjobs.push({ ...req.body });
  user.save();

  res.status(StatusCodes.OK).json({ msg: "Saved Successfullt" });
};

module.exports = { SaveJobs };
