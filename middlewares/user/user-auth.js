const { AuthenticationError } = require("../../erros");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserAuthenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthenticationError("Invalid authentication, Try again later");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new AuthenticationError("Invalid authentication");
  }
};

module.exports = UserAuthenticationMiddleware;
