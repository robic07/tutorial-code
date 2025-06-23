import User from "../models/users.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });
    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message || "Internal server error",
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user),
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message || "Internal server error",
    });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { oldPassword, newPassword } = req.body;
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ includeDeleted: true }).select("-password");
    res.json(users);
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message || "Internal server error",
    });
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message || "Internal server error",
    });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.name = name || user.name;
    user.email = email || user.email;
    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message || "Internal server error",
    });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.deletedAt)
      return res.status(404).json({ message: "User not found" });
    user.deletedAt = new Date();
    await user.save();
    res.json({ message: "User soft-deleted" });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message || "Internal server error",
    });
  }
};

export const restoreUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      includeDeleted: true,
    });
    if (!user || !user.deletedAt)
      return res.status(404).json({ message: "User not found or not deleted" });
    user.deletedAt = null;
    await user.save();
    res.json({ message: "User restored" });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message || "Internal server error",
    });
  }
};
