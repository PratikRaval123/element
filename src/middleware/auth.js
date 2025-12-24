const jwt = require("jsonwebtoken");
const User = require("../models/user");
const tokenStore = require("../utils/tokenStore");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  if (tokenStore.isRevoked(token)) {
    return res.status(401).json({ message: "Token revoked, please login again" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


