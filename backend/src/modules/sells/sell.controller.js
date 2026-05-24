import db from "../../models/index.js";
import { Op } from "sequelize";

const { Sale, SaleItem, Product, StockMovement } = db;

export const createSale = async (req, res) => {
  const t = await db.sequelize.transaction(); // 🔥 important for safety

  try {
    const {
      invoiceNo,
      customerId,
      paymentMethod,
      paymentStatus,
      items, // 👈 array of products from frontend
    } = req.body;

    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;
    let grandTotal = 0;

    // 1. Create main Sale
    const sale = await Sale.create(
      {
        invoiceNo,
        customerId,
        cashierId: req.user?.userId,
        paymentMethod,
        paymentStatus,
        subtotal: 0,
        discountTotal: 0,
        taxTotal: 0,
        grandTotal: 0,
      },
      { transaction: t }
    );

    // 2. Process each item
    for (const item of items) {
      const product = await Product.findByPk(item.productId, {
        transaction: t,
        lock: true,
      });

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      // ❌ Stock validation
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const unitPrice = product.sellingPrice;
      const lineTotal =
        unitPrice * item.quantity - (item.discount || 0) + (item.tax || 0);

      subtotal += unitPrice * item.quantity;
      discountTotal += item.discount || 0;
      taxTotal += item.tax || 0;
      grandTotal += lineTotal;

      // 3. Create SaleItem
      await SaleItem.create(
        {
          saleId: sale.id,
          productId: product.id,
          productNameSnapshot: product.name,
          quantity: item.quantity,
          unitPrice,
          discount: item.discount || 0,
          tax: item.tax || 0,
          lineTotal,
        },
        { transaction: t }
      );

      // 4. Update stock
      const previousStock = product.stock;
      const newStock = previousStock - item.quantity;

      await product.update(
        { stock: newStock },
        { transaction: t }
      );

      // 5. Stock Movement log
      await StockMovement.create(
        {
          productId: product.id,
          type: "OUT",
          quantity: item.quantity,
          previousStock,
          newStock,
          reason: "SALE",
          referenceId: sale.id,
          createdBy: req.user?.id,
        },
        { transaction: t }
      );
    }

    // 6. Update final totals in Sale
    await sale.update(
      {
        subtotal,
        discountTotal,
        taxTotal,
        grandTotal,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Sale created successfully",
      data: sale,
    });
  } catch (error) {
    await t.rollback();

    return res.status(500).json({
      success: false,
      message: "Error creating sale",
      error: error.message,
    });
  }
};

export const getAllSales = async (req, res) => {
  try {
    const { page = 1, limit = 10, invoiceNo } = req.query;

    const parsedLimit = parseInt(limit);
    const offset = (page - 1) * parsedLimit;

    const where = {};

    if (invoiceNo) {
      where.invoiceNo = {
        [Op.iLike]: `%${invoiceNo}%`,
      };
    }

    const { count, rows } = await Sale.findAndCountAll({
      where,
      limit: parsedLimit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: SaleItem,
          as: "items",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / parsedLimit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching sales",
      error: error.message,
    });
  }
};
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        {
          model: SaleItem,
          as: "items",
        },
      ],
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: sale,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching sale",
      error: error.message,
    });
  }
};