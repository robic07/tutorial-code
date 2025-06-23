import { body, param } from "express-validator";
import { validate } from "../utils/expressValidator.js";

const createUser = [
  body("name").notEmpty().withMessage("name is required"),
  body("email").notEmpty().isEmail().withMessage("email is invalid"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
];

const validateUpdatePassword = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

export const sanitizeCreateUser = [...createUser, validate];
export const sanitizeUpdatePassword = [...validateUpdatePassword, validate];


