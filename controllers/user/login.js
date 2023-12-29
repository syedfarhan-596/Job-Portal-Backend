const UserSchema = require("../../models/user/user");
const { AuthenticationError } = require("../../erros");
const { StatusCodes } = require("http-status-codes");

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

module.exports = { UserLoginController };
