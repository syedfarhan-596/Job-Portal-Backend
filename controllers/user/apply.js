const ApplySchema = require("../../models/apply/apply");
const { StatusCodes } = require("http-status-codes");

const UserApplyController = async (req, res) => {
  const { companyId, jobId } = req.params;

  const apply = await ApplySchema.create({
    ...req.body,
    appliedByUserId: req.user.userId,
    appliedCompanyId: companyId,
    appliedJobId: jobId,
  });
  res.status(StatusCodes.OK).json({ msg: `Applied Successfully  ` });
};

module.exports = { UserApplyController };
