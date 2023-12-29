//imports
const UserSchema = require("../../models/user/user");

const { UserLoginController } = require("./login");
const { UserRegisterController } = require("./register");
const { UserGetController } = require("./get-user");
const { UserGetAllJobs } = require("./get-jobs");
const { UserUpdateProfileController } = require("./user-update");
const { UserSingleJobController } = require("./get-job");
const { UserApplyController } = require("./apply");

const { SaveJobs } = require("./save-job");
const { DeleteSaveJobs } = require("./delete-save-job");

//export modules
module.exports = {
  UserLoginController,
  UserRegisterController,
  UserGetController,
  UserGetAllJobs,
  UserUpdateProfileController,
  UserSingleJobController,
  UserApplyController,

  SaveJobs,
  DeleteSaveJobs,
};
