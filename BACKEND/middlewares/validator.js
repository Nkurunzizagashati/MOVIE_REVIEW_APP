import { check, validationResult } from "express-validator";

const userValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is missing"),
  check("email").normalizeEmail().isEmail().withMessage("Invalid Email"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 to 20 characters long"),
];
const signInValidator = [
  check("email").normalizeEmail().isEmail().withMessage("Invalid Email"),
  check("password").trim().not().isEmpty().withMessage("Password is missing"),
];

const passwordValidator = [
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 to 20 characters long"),
];

const validate = (req, res, next) => {
  const error = validationResult(req).array();

  if (error.length) {
    return res.json({ Error: error[0].msg });
  }

  next();
};

export { validate, userValidator, passwordValidator, signInValidator };
