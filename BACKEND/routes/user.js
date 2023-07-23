import express from "express";
import {
  create,
  forgetPassword,
  resendEmailVerificationToken,
  resetPassword,
  sendResetPasswordTokenStatus,
  signIn,
  verifyEmail,
} from "../controllers/user.js";
import {
  passwordValidator,
  signInValidator,
  userValidator,
  validate,
} from "../middlewares/validator.js";
import { isValidPasswordResetToken } from "../middlewares/user.js";

const router = express.Router();

router.post("/create", userValidator, validate, create);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post(
  "/verify-reset-pass-token",
  isValidPasswordResetToken,
  sendResetPasswordTokenStatus
);

router.post(
  "/reset-password",
  isValidPasswordResetToken,
  passwordValidator,
  validate,
  resetPassword
);

router.post("/sign-in", signInValidator, validate, signIn);

export default router;
