const JobSchema = require("../../models/jobs/jobs");
const { BadRequestError } = require("../../erros/");
class UserJobs {
  //get jobs
  static async getAllJobs(reqQuery) {
    const {
      name,
      location,
      skills,
      page = 1,
      maxSalary,
      sortby,
      postedDate = "Any time",
      employmentType,
      experienceLevel,
      company,
      industry,
    } = reqQuery;

    //If provided the we include in query object and filter out result
    console.log(reqQuery);

    let QueryObject = {};
    const skip = (page - 1) * 10;
    if (name) {
      QueryObject.title = { $regex: name, $options: "i" };
    }

    if (location) {
      if (location && Array.isArray(location)) {
        QueryObject.location = {
          $in: location,
        };
      } else {
        QueryObject.location = { $regex: location, $options: "i" };
      }
    }

    if (skills && Array.isArray(skills)) {
      QueryObject.skills = {
        $in: skills.map((skill) => new RegExp(skill, "i")),
      };
    }
    if (employmentType && Array.isArray(employmentType)) {
      QueryObject.employmentType = {
        $in: employmentType.map((type) => new RegExp(type, "i")),
      };
    }
    if (experienceLevel && Array.isArray(experienceLevel)) {
      QueryObject.experienceLevel = {
        $in: experienceLevel.map((experience) => new RegExp(experience, "i")),
      };
    }

    if (industry && Array.isArray(industry)) {
      QueryObject.industry = {
        $in: industry.map((industry) => new RegExp(industry, "i")),
      };
    }

    if (maxSalary) {
      QueryObject.maxSalary = { $gt: maxSalary };
    }

    if (postedDate && postedDate !== "Any time") {
      let startDate;

      // Calculate the start date based on the specified date range
      switch (postedDate) {
        case "Past 24":
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
          break;
        case "Past week":
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
          break;
        case "Past month":
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
          break;
        default:
          break;
      }
      if (company) {
        QueryObject.company = { $regex: company, $options: "i" };
      }

      if (startDate) {
        QueryObject.createdAt = { $gte: startDate };
      }
    }

    const jobs = await JobSchema.find(QueryObject)
      .sort({ createdAt: sortby === "createdAt" ? 1 : -1 })
      .skip(skip)
      .limit(10);
    const count = await JobSchema.countDocuments(QueryObject);
    return { jobs, count, params: reqQuery };
  }

  //get single job
  static async getSingleJob(id) {
    const job = await JobSchema.findOne({ _id: id });
    if (!job) {
      throw new BadRequestError("No job with that id");
    }
    return { job };
  }

  //get similar job
  static async getSimilarJob(jobId, industry) {
    const similarJob = await JobSchema.find({
      _id: { $ne: jobId },
      industry,
    }).limit(5);
    return { similarJob };
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
