const UserSchema = require("../../models/user/user");
const Company = require("../../models/company/company");
const ConversationSchema = require("../../models/conversation/conversation");
const MessageSchema = require("../../models/conversation/message");
const ApplySchema = require("../../models/apply/apply");
const { BadRequestError } = require("../../erros");

class Userservices {
  //get user detail
  static async getUser(id) {
    const user = await UserSchema.findOne({ _id: id }).select("-password");

    return { user };
  }

  //update user details
  static async updateUser(reqUser, reqData, reqFile) {
    const { preferences } = reqData;
    //creating a object to update all changed details in one request

    const updatedFields = {};

    // if data is provided then it will be included in the
    if (reqFile) {
      updatedFields[
        "profile.resume"
      ] = `localhost:4000/resume/${reqFile.filename}`;
    }

    const profileFields = [
      "education",
      "basic",
      "address",
      "skills",
      "experience",
      "summary",
    ];
    profileFields.forEach((field) => {
      if (reqData[field]) {
        updatedFields[`profile.${field}`] = reqData[field];
      }
    });

    // Include preferences in updatedFields object if data is provided
    if (preferences) {
      updatedFields["preferences"] = {
        location: preferences.location,
        jobTitle: preferences.jobTitle,
      };
    }
    if (preferences) {
      updatedFields["preferences"] = {
        location: preferences.location,
        jobTitle: preferences.jobTitle,
      };
    }
    const user = await UserSchema.findOneAndUpdate(
      { _id: reqUser },
      { $set: updatedFields },
      { new: true, runValidators: true, select: "-password" }
    );
    if (!user) {
      throw new BadRequestError("No user found to update");
    }
    return { user };
  }

  //get companies
  static async getCompanies(reqQuery) {
    const { page = 1, location, company, industry } = reqQuery;
    const skip = (page - 1) * 10;

    let QueryObject = {};

    if (location) {
      if (location && Array.isArray(location)) {
        QueryObject.location = {
          $in: location.map((location) => new RegExp(location, "i")),
        };
      } else {
        QueryObject.location = { $regex: location, $options: "i" };
      }
    }
    if (company) {
      if (Array.isArray(company)) {
        QueryObject.name = {
          $in: company.map((company) => new RegExp(company, "i")),
        };
      } else {
        QueryObject.name = { $regex: company, $options: "i" };
      }
    }
    if (industry) {
      if (Array.isArray(industry)) {
        QueryObject.industry = {
          $in: industry.map((industry) => new RegExp(industry, "i")),
        };
      } else {
        QueryObject.industry = { $regex: industry, $options: "i" };
      }
    }

    const companies = await Company.find(QueryObject)
      .select("-email -password ")
      .skip(skip)
      .limit(10);
    const count = await Company.countDocuments(QueryObject);
    return { companies, count };
  }

  //get single company
  static async getCompany(companyId) {
    const company = await Company.findById({ _id: companyId }).select(
      "-password"
    );
    return { company };
  }

  //get similar company
  static async getSimilarCompany(companyId, industry) {
    const similarCompany = await Company.find({
      _id: { $ne: companyId },
      industry,
    })
      .select("-password")
      .limit(3);
    return { similarCompany };
  }

  //save job in user profile
  static async saveJob(jobDetails, reqUser, reqBody) {
    reqBody.jobId = jobDetails;
    const user = await UserSchema.findOne({ _id: reqUser });
    user.savedjobs.push({ ...reqBody });
    user.save();

    return { msg: "Successfully saved" };
  }

  //unsave job from user profile
  static async unSaveJob(jobDetails, reqUser) {
    let user = await UserSchema.findOne({ _id: reqUser });
    const indexOfSavedJob = user.savedjobs
      .map((item) => item.jobId)
      .indexOf(jobDetails);
    user.savedjobs.splice(indexOfSavedJob, 1);
    user.save();

    return { msg: "Successfully unsaved" };
  }

  //user apply for job
  static async applyJob(companyId, reqUser, jobId, reqBody) {
    await ApplySchema.create({
      ...reqBody,
      appliedByUserId: reqUser,
      appliedCompanyId: companyId,
      appliedJobId: jobId,
    });
    return { msg: "Applied Successfully" };
  }

  //get applications
  static async applications(userId) {
    const applications = await ApplySchema.find({ appliedByUserId: userId });
    return { applications };
  }

  //get user conversations
  static async getConversaions(reqUser) {
    const conversations = await ConversationSchema.find({
      members: { $in: [reqUser] },
    });
    const usersPromises = conversations.map(async (item) => {
      const userId = item.members.find((id) => id !== reqUser);
      const user = await Company.findById(userId).select("name email");
      return { ...user.toObject(), conversationId: item._id };
    });
    const conversationUsers = await Promise.all(usersPromises);

    return { conversationUsers };
  }

  //get message
  static async getMessages(conversationId) {
    const messages = await MessageSchema.find({ conversationId });
    return { messages };
  }

  //send message
  static async sendMessage(data) {
    const newMessage = await MessageSchema.create(data);

    return { newMessage };
  }
}

module.exports = Userservices;
