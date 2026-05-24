import { Op } from "sequelize";
import db from "../../models/index.js";

const { Product, Category } = db;

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user?.id, // if auth middleware sets user
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// GET ALL PRODUCTS (Upgraded with Pagination, Search, and Filters)
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", categoryId, status } = req.query;
    
    // Parse pagination variables
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = (parseInt(page, 10) - 1) * parsedLimit;

    // Building search and filter queries dynamically
    const whereCondition = {};

    // 1. Search filter (Searches across Name, SKU, and Barcode)
    if (search) {
      whereCondition[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search
        { sku: { [Op.iLike]: `%${search}%` } },
        { barcode: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // 2. Dropdown Filter by Category
    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    // 3. Dropdown Filter by Status
    if (status) {
      whereCondition.status = status;
    }

    // Fetch products with count for pagination metadata
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereCondition,
      limit: parsedLimit,
      offset: parsedOffset,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"], // Only fetch what frontend needs
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / parsedLimit),
        currentPage: parseInt(page, 10),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// GET SINGLE PRODUCT (Upgraded with Category Details)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "status"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.update({
      ...req.body,
      updatedBy: req.user?.id,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.destroy();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};