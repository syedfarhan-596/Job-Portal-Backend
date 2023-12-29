const { StatusCodes } = require("http-status-codes");
const UserSchema = require("../../models/user/user");

const UserGetController = async (req, res) => {
  const user = await UserSchema.findOne({ _id: req.user.userId }).select(
    "-password"
  );
  res.status(StatusCodes.OK).json({ user });
};

module.exports = { UserGetController };
