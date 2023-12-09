// installed packages imports
const express = require("express");

//import middleware
const UserAuthenticationMiddleware = require("../../middlewares/user/user-auth");

//import controllers
const {
  LoginController,
  RegisterController,
  UpdateController,
  GetContorller,
  ApplyController,
} = require("../../controllers/user/user-auth");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads/resume"),
  filename: (req, file, cd) => {
    return cd(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({
  storage: storage,
});

//using router
const router = express.Router();

//user routes

router.route("/login").post(LoginController);
router.route("/register").post(RegisterController);
router.route("/get").get(UserAuthenticationMiddleware, GetContorller);
router
  .route("/update")
  .patch(
    upload.single("resumefile"),
    UserAuthenticationMiddleware,
    UpdateController
  );
router.route("/:id/apply").post(UserAuthenticationMiddleware, ApplyController);

module.exports = router;
