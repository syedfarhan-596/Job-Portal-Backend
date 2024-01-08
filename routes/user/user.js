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
  UserGetAllConversations,
  SaveJobs,
  DeleteSaveJobs,
  GetMessages,
  SendMessage,
} = require("../../controllers/user/user");

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

router
  .route("/messages")
  .get(UserAuthenticationMiddleware, UserGetAllConversations);

router
  .route("/messages/:conversationId")
  .get(UserAuthenticationMiddleware, GetMessages);

router.route("/send/message").post(UserAuthenticationMiddleware, SendMessage);

module.exports = router;
