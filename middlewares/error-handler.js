const { StatusCodes } = require("http-status-codes");

const ErrorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };
  if (err && err.code === 11000 && err.keyPattern.appliedByUserId) {
    (customError.statusCode = StatusCodes.CONFLICT),
      (customError.msg = "Already Applied For This Job");
  }
  if (err && err.code === 11000 && err.keyPattern.email) {
    (customError.statusCode = StatusCodes.CONFLICT),
      (customError.msg = "Email Already exists, Try logging in");
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = ErrorHandlerMiddleware;
