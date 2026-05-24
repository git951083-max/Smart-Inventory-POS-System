import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../catagory/category.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();


// ======================
// CREATE CATEGORY
// Only ADMIN + SUPER_ADMIN
// ======================
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  createCategory
);


// ======================
// GET ALL CATEGORIES
// ADMIN, MANAGER, EMPLOYEE
// ======================
router.get(
  "/",
  protect,
  authorizeRoles("ADMIN", "MANAGER", "EMPLOYEE"),
  getAllCategories
);


// ======================
// GET SINGLE CATEGORY
// ADMIN, MANAGER, EMPLOYEE
// ======================
router.get(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "MANAGER", "EMPLOYEE"),
  getCategoryById
);


// ======================
// UPDATE CATEGORY
// Only ADMIN + SUPER_ADMIN
// ======================
router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  updateCategory
);


// ======================
// DELETE CATEGORY
// Only ADMIN + SUPER_ADMIN
// ======================
router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  deleteCategory
);

export default router;