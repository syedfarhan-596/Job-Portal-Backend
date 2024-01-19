const UserSchema = require("../../models/user/user");
const { AuthenticationError } = require("../../erros");
const bcrypt = require("bcryptjs");
class AuthService {
  //login route
  static async loginUser(email, password) {
    // Validate input
    if (!email || !password) {
      throw new AuthenticationError("Please provide email/password");
    }

    // Retrieve user from the database
    const user = await UserSchema.findOne({ email });

    // Check if the user exists
    if (!user) {
      throw new AuthenticationError(`No user with ${email} this email`);
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new AuthenticationError("Invalid Email/Password, Please try again");
    }

    // Generate and return authentication token
    const token = user.createJWT();
    return { user, token };
  }

  //register
  static async registerUser(userData) {
    //validating if both passwords match
    const { password, password2 } = userData;
    if (password !== password2) {
      throw new AuthenticationError("Password Mismatch");
    }
    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    //creating the user with hashed password
    const user = await UserSchema.create({
      ...userData,
      password: newPassword,
    });
    const token = user.createJWT();
    return { user, token };
  }
}

module.exports = AuthService;
