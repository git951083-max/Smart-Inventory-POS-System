import express from "express";

import {
  createSale,
  getAllSales,
  getSaleById,
} from "./sell.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * 🧾 CREATE SALE (Billing / POS)
 * Access: ADMIN, MANAGER, CASHIER, EMPLOYEE
 */
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN", "MANAGER", "CASHIER", "EMPLOYEE"),
  createSale
);

/**
 * 📄 GET ALL SALES (List / Reports)
 * Access: ADMIN, MANAGER
 */
router.get(
  "/",
  protect,
  authorizeRoles("ADMIN", "MANAGER"),
  getAllSales
);

/**
 * 📄 GET SINGLE SALE (Invoice Detail)
 * Access: ADMIN, MANAGER, CASHIER
 */
router.get(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "MANAGER", "CASHIER"),
  getSaleById
);

export default router;