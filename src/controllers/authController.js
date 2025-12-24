const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");
const tokenStore = require("../utils/tokenStore");

const crypto = require("crypto");

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "2h" });

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // In a real application, send this token via email.
  // For now, we return it in the response for testing.
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/reset-password/${resetToken}`;

  res.json({
    message: "Reset token generated",
    resetToken,
    resetUrl,
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
  });

  res.json({ message: "Password reset successful" });
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json(user);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (token) {
    tokenStore.add(token);
  }
  res.json({ message: "Logged out" });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current and new password are required" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const matched = await bcrypt.compare(currentPassword, user.password);
  if (!matched) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated" });
});
