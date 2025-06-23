import express from "express";

import {
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  restoreUser,
  updateUser,
  updatePassword,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

import { sanitizeUpdatePassword } from "../validations/userValidator.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/:id/restore", verifyToken, restoreUser);
router.put(
  "/:id/password",
  verifyToken,
  sanitizeUpdatePassword,
  updatePassword
);

export default router;
