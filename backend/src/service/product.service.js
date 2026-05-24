import db from "../models/index.js";

const { Product } = db;

// CREATE PRODUCT
export const createProductService = async (data) => {
  const product = await Product.create(data);
  return product;
};

// GET ALL PRODUCTS
export const getAllProductsService = async () => {
  const products = await Product.findAll({
    order: [["createdAt", "DESC"]],
  });

  return products;
};

// GET SINGLE PRODUCT
export const getProductByIdService = async (id) => {
  const product = await Product.findByPk(id);
  return product;
};

// UPDATE PRODUCT
export const updateProductService = async (id, data) => {
  const product = await Product.findByPk(id);

  if (!product) {
    return null;
  }

  await product.update(data);
  return product;
};

// DELETE PRODUCT
export const deleteProductService = async (id) => {
  const product = await Product.findByPk(id);

  if (!product) {
    return null;
  }

  await product.destroy();
  return true;
};