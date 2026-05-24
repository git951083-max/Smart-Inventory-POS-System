// routes/product.routes.js

import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../product/product.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();


// ======================
// CREATE PRODUCT
// Only ADMIN + SUPER_ADMIN
// ======================
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  createProduct
);


// ======================
// GET ALL PRODUCTS
// ADMIN, MANAGER, EMPLOYEE
// ======================
router.get(
  "/",
  protect,
  authorizeRoles("ADMIN", "MANAGER", "EMPLOYEE"),
  getAllProducts
);


// ======================
// GET SINGLE PRODUCT
// ADMIN, MANAGER, EMPLOYEE
// ======================
router.get(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "MANAGER", "EMPLOYEE"),
  getProductById
);


// ======================
// UPDATE PRODUCT
// Only ADMIN + SUPER_ADMIN
// ======================
router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  updateProduct
);


// ======================
// DELETE PRODUCT
// Only ADMIN + SUPER_ADMIN
// ======================
router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  deleteProduct
);

export default router;