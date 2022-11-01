const express = require("express");
const {
  registerUser,
  checkPasswordResetCode,
  passwordChange,
  activateAccount,
  login,
  resendEmailVerification,
  passwordResendCode,
  searchByEmail,
  logout,
} = require("../controllers/userController");
const { userValidate } = require("../validation/UserValidation");
const {
  checkDuplicatePhoneOrEmail,
  checkUserName,
} = require("../middleware/VerifySignUp");
const { protectedRoute } = require("../middleware/authMiddleware");
const router = express.Router();
// router.route("/").post(registerUser).get(protectedRoute, getUser);
router.post(
  "/register",
  userValidate("createUser"),
  checkDuplicatePhoneOrEmail,
  checkUserName,
  registerUser
);
router.post("/password-change", userValidate("changePassword"), passwordChange);
router.post("/activate-account", protectedRoute, activateAccount);
router.post(
  "/resent-email-verification",
  protectedRoute,
  resendEmailVerification
);
router.post("/password-resend-code", passwordResendCode);
router.get("/search-by-email", protectedRoute, searchByEmail);
router.post("/check-passwordreset-code", checkPasswordResetCode);
router.post("/login", login);
router.post("/logout", logout);
module.exports = router;
