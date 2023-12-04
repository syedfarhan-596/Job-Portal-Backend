const { StatusCodes } = require("http-status-codes");
const NotFoundError = (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ msg: `Error 404 ${req.url} doesn't exists` });
};

module.exports = NotFoundError;
