import User from "../models/user.js";
import emailVerificationToken from "../models/emailVerificationToken.js";
import { isValidObjectId } from "mongoose";
import { generateMailTransporter, generateOTP } from "../utils/mail.js";
import { sendError, generateRandomByte } from "../utils/helper.js";
import passwordResetToken from "../models/passwordResetToken.js";
import jwt from "jsonwebtoken";

const create = async (req, res) => {
  const { email, name, password } = req.body;
  const oldUser = await User.findOne({ email });
  if (oldUser) return sendError(res, "This email is already in use");
  const NewUser = await User.create({ name, email, password });

  const OTP = generateOTP();

  // SAVE OTP INSIDE OUR DB

  const newEmailVerificationToken = await emailVerificationToken.create({
    owner: NewUser._id,
    token: OTP,
  });

  // SEND OTP TO THE USER

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@theOne.com",
    to: NewUser.email,
    subject: "Email verification",
    html: `
    <p>Your Verification Token is: </p>
    <h1>${OTP}</h1>
    `,
  });
  res.status(201).json({
    message:
      "Please verify your email. OTP has been sent to your email account",
  });
};

const verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId)) return sendError(res, "Invalid user");
  const user = await User.findById(userId);
  if (!user) return sendError(res, "user not found", 404);
  if (user.isVerified) return sendError(res, "user is already verified");

  const token = await emailVerificationToken.findOne({ owner: userId });
  if (!token) return sendError(res, "token not found");

  const isMatch = await token.compareToken(OTP);

  if (!isMatch) return sendError(res, "Please submit a valid OTP");

  user.isVerified = true;
  await user.save();

  await emailVerificationToken.findByIdAndDelete(token._id);

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@theOne.com",
    to: user.email,
    subject: "Welcome Email",
    html: "<h1>Welcome to our app and thanks for choosing us!</h1>",
  });

  res.json({ message: "Your email is verified" });
};

const resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;
  if (!isValidObjectId(userId)) return sendError(res, "Invalid user");
  const user = await User.findById(userId);
  if (!user) return sendError(res, "user not found", 404);

  if (user.isVerified) return sendError(res, "user is already verified");

  const alreadyHasToken = await emailVerificationToken.findOne({
    owner: userId,
  });
  if (alreadyHasToken)
    return sendError(res, "Only after an hour you can ask for an other token");

  // GENERATE OTP

  let OTP = generateOTP();
  // SAVE OTP INSIDE OUR DB

  const newEmailVerificationToken = await emailVerificationToken.create({
    owner: user._id,
    token: OTP,
  });

  // SEND OTP TO THE USER

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@theOne.com",
    to: user.email,
    subject: "Email verification",
    html: `
    <p>Your Verification Token is: </p>
    <h1>${OTP}</h1>
    `,
  });
  res.json({
    message:
      "Please verify your email. OTP has been sent to your email account",
  });
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return sendError(res, "Email is missing");
  const user = await User.findOne({ email });
  if (!user) return sendError(res, "user not found", 404);

  const alreadyHasToken = await passwordResetToken.findOne({ owner: user._id });

  if (alreadyHasToken)
    return sendError(res, "Only after an hour you can ask for an other token");

  const token = await generateRandomByte();
  const newPasswordResetToken = await passwordResetToken.create({
    owner: user._id,
    token,
  });

  const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`;

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@theOne.com",
    to: user.email,
    subject: "Reset Password",
    html: `
    <p>Click the link bellow to reset your password</p>
    <a href='${resetPasswordUrl}'>Change Password</a>
    `,
  });
  res.status(201).json({
    message:
      "The link to reset your password has been sent to your email account",
  });
};

const sendResetPasswordTokenStatus = async (req, res) => {
  res.json({ Valid: true });
};

const resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  const user = await User.findById(userId);
  const matched = await user.comparePasswords(newPassword);

  if (matched)
    return sendError(res, "New password must be different from the old one");

  user.password = newPassword;
  await user.save();

  await passwordResetToken.findByIdAndDelete(req.resetToken._id);

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@theOne.com",
    to: user.email,
    subject: "Password Reset Successfully!",
    html: `
    <p>Password Reset Successfully!</p>
    <p >Now you can use the new password</p>
    `,
  });

  res.json({
    message: "Password reset successfully, now you can use the new password",
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "Password/Email mismatch");

  const matched = await user.comparePasswords(password);
  if (!matched) return sendError(res, "Password/Email mismatch");

  const jwtToken = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: jwtToken,
  });
};

export {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
  sendResetPasswordTokenStatus,
  resetPassword,
  signIn,
};
