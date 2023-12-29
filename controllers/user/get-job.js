const JobSchema = require("../../models/jobs/jobs");

const { BadRequestError } = require("../../erros");
const { StatusCodes } = require("http-status-codes");

const UserSingleJobController = async (req, res) => {
  const { id } = req.params;
  const job = await JobSchema.findOne({ _id: id });
  if (!job) {
    throw new BadRequestError("No job with that id");
  }
  res.status(StatusCodes.OK).json(job);
};

module.exports = { UserSingleJobController };
