const JobSchema = require("../../models/jobs/jobs");
const { BadRequestError } = require("../../erros/");
class UserJobs {
  //get jobs
  static async getAllJobs(reqQuery) {
    const { name, location, skills, page = 1 } = reqQuery;

    //If provided the we include in query object and filter out result
    let QueryObject = {};
    const skip = (page - 1) * 10;
    if (name) {
      QueryObject.title = { $regex: name, $options: "i" };
    }
    if (location) {
      QueryObject.location = { $regex: location, $options: "i" };
    }
    if (skills && Array.isArray(skills)) {
      QueryObject.skills = {
        $in: skills.map((skill) => new RegExp(skill, "i")),
      };
    }
    const jobs = await JobSchema.find(QueryObject)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(10);
    const count = await JobSchema.countDocuments(QueryObject);
    return { jobs, count };
  }

  //get single job
  static async getSingleJob(id) {
    const job = await JobSchema.findOne({ _id: id });
    if (!job) {
      throw new BadRequestError("No job with that id");
    }
    return { job };
  }

  //get jobs by ids
  static async getJobsByIds(reqBody) {
    const jobIds = reqBody.savedJobs?.map((item) => item.jobId);
    const jobs = await JobSchema.find({ _id: { $in: jobIds } });
    return { jobs };
  }

  //get jobs based on company
  static async getCompanyJobs(reqQuery, companyId) {
    const { page = 1 } = reqQuery;
    const skip = (page - 1) * 10;
    const jobs = await JobSchema.find({ postedBy: companyId })
      .skip(skip)
      .limit(10);
    const count = await JobSchema.countDocuments({ postedBy: companyId });
    return { jobs, count };
  }
}

module.exports = UserJobs;
