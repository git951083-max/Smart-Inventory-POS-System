export default (sequelize, DataTypes) => {
  const SaleItem = sequelize.define(
    "SaleItem",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      saleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "sales",
          key: "id",
        },
      },

      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },

      productNameSnapshot: {
        type: DataTypes.STRING,
        allowNull: false, // Future proofing: product delete/edit hone par bhi history sahi rahegi
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1, // Kam se kam 1 quantity bechna zaroori hai
        },
      },

      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Jis price par product bika
      },

      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },

      tax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },

      lineTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // (unitPrice * quantity) - discount + tax
      },
    },
    {
      tableName: "sale_items",
      timestamps: true,
    }
  );

  SaleItem.associate = (models) => {
    // Har ek sale item kisi na kisi main sale bill se juda hoga
    SaleItem.belongsTo(models.Sale, {
      foreignKey: "saleId",
      as: "sale",
    });

    // Har ek item ka ek real product se link hoga
    SaleItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  };

  return SaleItem;
};