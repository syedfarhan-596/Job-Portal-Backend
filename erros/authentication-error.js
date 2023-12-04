const CustomAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");

class AuthenticationError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = AuthenticationError;
