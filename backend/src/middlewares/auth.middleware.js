// src/middlewares/auth.middleware.js

import jwt from "jsonwebtoken";

/**
 * Protect Middleware
 * Verifies access token from cookies or Authorization header
 */

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization Header
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Check Cookies
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    /**
     * req.user available everywhere after this
     *
     * req.user = {
     *   userId,
     *   email,
     *   role
     * }
     */

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Protect middleware error:", error);

    // Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
      });
    }

    // Invalid token
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};