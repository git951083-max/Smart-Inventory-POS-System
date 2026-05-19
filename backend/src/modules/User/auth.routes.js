import express from "express";

import {
  register,
  login,
  logout,
  getMe,
  refreshToken,
} from "./auth.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";

import { authorizeRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * Public Routes
 */
router.post("/register", register);
router.post("/login", login);

/**
 * Protected Routes
 */

// Logged in user
router.get(
  "/me",
  protect,
  getMe
);

// Logout
router.post(
  "/logout",
  protect,
  logout
);

/**
 * Role Based Example Routes
 */

// Only ADMIN & SUPER_ADMIN
router.get(
  "/admin-only",
  protect,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

// Only SUPER_ADMIN
router.get(
  "/super-admin-only",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome Super Admin",
      user: req.user,
    });
  }
);
router.post("/refresh-token", refreshToken);

// ADMIN + MANAGER + EMPLOYEE
router.get(
  "/employee-panel",
  protect,
  authorizeRoles(
    "ADMIN",
    "MANAGER",
    "EMPLOYEE"
  ),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Employee Panel Access Granted",
      user: req.user,
    });
  }
);

export default router;