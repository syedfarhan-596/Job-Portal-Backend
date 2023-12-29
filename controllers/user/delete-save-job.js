const UserSchema = require("../../models/user/user");
const { StatusCodes } = require("http-status-codes");

const DeleteSaveJobs = async (req, res) => {
  const { id } = req.params;
  let user = await UserSchema.findOne({ _id: req.user.userId });
  const indexOfSavedJob = user.savedjobs.map((item) => item.jobId).indexOf(id);
  user.savedjobs.splice(indexOfSavedJob, 1);
  user.save();
  res.status(StatusCodes.OK).json({ msg: "removed" });
};

module.exports = { DeleteSaveJobs };
