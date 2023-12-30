// installed packages imports
const express = require("express");

//import middleware
const UserAuthenticationMiddleware = require("../../middlewares/user/user-auth");
const Multer = require("../../multer");

//import controllers
const {
  UserLoginController,
  UserRegisterController,
  UserGetController,
  UserGetAllJobs,
  UserUpdateProfileController,
  UserSingleJobController,
  UserApplyController,

  SaveJobs,
  DeleteSaveJobs,
} = require("../../controllers/user");
const {
  GetUserSingleJobController,
} = require("../../controllers/user/get-job");

//multer
const upload = Multer();

//using router
const router = express.Router();

//user routes

// login route for user
router.route("/login").post(UserLoginController);

// register route for user

router.route("/register").post(UserRegisterController);

// get user route
router.route("/get").get(UserAuthenticationMiddleware, UserGetController);

router
  .route("/update")
  .patch(
    upload.single("resumefile"),
    UserAuthenticationMiddleware,
    UserUpdateProfileController
  );

router.route("/get/jobs").get(UserAuthenticationMiddleware, UserGetAllJobs);
router
  .route("/get/jobs/job/:id")
  .get(UserAuthenticationMiddleware, UserSingleJobController);

router
  .route("/save/job/:id")
  .post(UserAuthenticationMiddleware, SaveJobs)
  .delete(UserAuthenticationMiddleware, DeleteSaveJobs);

router
  .route("/apply/:companyId/:jobId")
  .post(UserAuthenticationMiddleware, UserApplyController);

module.exports = router;
