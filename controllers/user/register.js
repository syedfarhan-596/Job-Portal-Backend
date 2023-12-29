const UserSchema = require("../../models/user/user");
const { AuthenticationError } = require("../../erros");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

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

module.exports = { UserRegisterController };
