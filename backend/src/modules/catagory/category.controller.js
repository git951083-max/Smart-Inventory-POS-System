import db from "../../models/index.js";
const { Category } = db;

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

// GET ALL CATEGORIES (Upgraded for dynamic filtering)
export const getAllCategories = async (req, res) => {
  try {
    const { status } = req.query; // Admin dashboard par INACTIVE dekhne ke liye optionally status pass kar sakte ho
    
    const whereCondition = {};
    if (status) {
      whereCondition.status = status;
    }

    const categories = await Category.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// GET CATEGORY BY ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: ["products"],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

// DELETE CATEGORY (soft delete)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.destroy();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};