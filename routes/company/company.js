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
  GetAppliedUserController,
  AllPostedJobsController,
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
  .route("/job/appliedby/:userid")
  .get(CompanyAuthenticationMiddleware, GetAppliedUserController);
module.exports = router;
