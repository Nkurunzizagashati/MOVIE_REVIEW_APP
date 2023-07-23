import { isValidObjectId } from "mongoose";
import passwordResetToken from "../models/passwordResetToken.js";
import { sendError } from "../utils/helper.js";

const isValidPasswordResetToken = async (req, res, next) => {
  const { token, userId } = req.body;
  if (!token.trim() || !isValidObjectId(userId))
    return sendError(res, "Invalid request");

  const resetToken = await passwordResetToken.findOne({ owner: userId });
  if (!resetToken)
    return sendError(res, "Unauthorized access, Invalid request!");

  const matched = await resetToken.compareToken(token);

  if (!matched) return sendError(res, "Unauthorized access, Invalid request!");

  req.resetToken = resetToken;

  next();
};

export { isValidPasswordResetToken };
