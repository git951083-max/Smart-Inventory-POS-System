// models/Product.model.js

export default (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 150],
        },
      },

      sku: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },

      barcode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      brand: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      unit: {
        type: DataTypes.STRING,
        allowNull: true, // pcs, kg, box
      },

      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
      },

      purchasePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },

      sellingPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },

      stockQty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      lowStockLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        validate: {
          min: 0,
        },
      },

      taxRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE", "DISCONTINUED"),
        defaultValue: "ACTIVE",
      },
    },
    {
      tableName: "products",

      timestamps: true,

      paranoid: true, // soft delete

      indexes: [
        {
          unique: true,
          fields: ["sku"],
        },
        {
          unique: true,
          fields: ["barcode"],
        },
      ],
    }
  );

  // Associations
  Product.associate = (models) => {
    // Product belongs to Category
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });

    // Product can be created by User (optional future feature)
    Product.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
    });
  };

  return Product;
};