const { StatusCodes } = require("http-status-codes");
const JobSchema = require("../../models/jobs/jobs");

const UserGetAllJobs = async (req, res) => {
  const { name, location, skills } = req.query;

  let QueryObject = {};
  if (name) {
    QueryObject.title = { $regex: name, $options: "i" };
  }
  if (location) {
    QueryObject.location = { $regex: location, $options: "i" };
  }
  if (skills && Array.isArray(skills)) {
    QueryObject.skills = { $in: skills.map((skill) => new RegExp(skill, "i")) };
  }

  const jobs = await JobSchema.find(QueryObject).sort("createdAt");

  // redisClient.set(cacheKey, JSON.stringify(jobs), "EX", 3600);
  res.status(StatusCodes.OK).json({ jobs, total: jobs.length, cached: false });
};

//const cacheKey = `jobs:${name || ""}:${location || ""}:${skills || ""}`;

// Check if the results are already in the Redis cache
// const cachedResults = await redisClient.get(cacheKey);
// if (cachedResults) {
//   const jobs = JSON.parse(cachedResults);
//   return res
//     .status(StatusCodes.OK)
//     .json({ jobs, total: jobs.length, cached: true });
// }

//if not in cache then query the database

module.exports = { UserGetAllJobs };
