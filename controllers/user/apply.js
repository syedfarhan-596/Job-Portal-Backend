const ApplySchema = require("../../models/apply/apply");
const { StatusCodes } = require("http-status-codes");

const UserApplyController = async (req, res) => {
  const { companyId, jobId } = req.params;
  req.body.appliedByUserId = req.user.userId;
  req.body.appliedCompanyId = companyId;
  req.body.appliedJob = jobId;
  const apply = await ApplySchema.create({ ...req.body });
  res.status(StatusCodes.OK).json({ msg: `Applied Successfully  ` });
};

module.exports = { UserApplyController };
