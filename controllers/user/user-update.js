const UserSchema = require("../../models/user/user");
const { BadRequestError } = require("../../erros");
const { StatusCodes } = require("http-status-codes");

const UserUpdateProfileController = async (req, res) => {
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

module.exports = { UserUpdateProfileController };
