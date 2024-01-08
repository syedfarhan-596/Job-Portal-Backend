const express = require("express");
const router = express.Router();
const CompanyAuthenticationMiddleware = require("../../middlewares/company/company-auth");
const {
  RegisterController,
  LoginController,
  GetController,
  UpdateController,
  CreateJob,
  GetJobController,
  UpdateJobController,
  AllPostedJobsController,
  GetAllAppliedUsers,
  GetSingleJobAppliedUsers,
  GetSingleUser,
  DeleteJob,
  NewConversationController,
  GetConversationController,
  SendMessage,
  GetMessages,
} = require("../../controllers/company/company-auth");

router.route("/login").post(LoginController);
router.route("/register").post(RegisterController);
router.route("/get").get(CompanyAuthenticationMiddleware, GetController);
router
  .route("/update")
  .patch(CompanyAuthenticationMiddleware, UpdateController);

router.route("/createjob").post(CompanyAuthenticationMiddleware, CreateJob);
router
  .route("/job/:id")
  .get(CompanyAuthenticationMiddleware, GetJobController)
  .patch(CompanyAuthenticationMiddleware, UpdateJobController);

router
  .route("/jobs")
  .get(CompanyAuthenticationMiddleware, AllPostedJobsController);

router
  .route("/get/applied/users")
  .get(CompanyAuthenticationMiddleware, GetAllAppliedUsers);
router
  .route("/get/applied/users/job/:id")
  .get(CompanyAuthenticationMiddleware, GetSingleJobAppliedUsers);

router
  .route("/get/applied/users/user/:userId")
  .get(CompanyAuthenticationMiddleware, GetSingleUser);

router
  .route("/delete/job/:jobId")
  .delete(CompanyAuthenticationMiddleware, DeleteJob);

router
  .route("/messages")
  .post(CompanyAuthenticationMiddleware, NewConversationController)
  .get(CompanyAuthenticationMiddleware, GetConversationController);

router
  .route("/messages/:conversationId")
  .get(CompanyAuthenticationMiddleware, GetMessages);

router
  .route("/send/message")
  .post(CompanyAuthenticationMiddleware, SendMessage);

module.exports = router;
