export default (sequelize, DataTypes) => {
  const Sale = sequelize.define(
    "Sale",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      invoiceNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Invoice number humesha unique hona chahiye
      },

      customerId: {
        type: DataTypes.UUID,
        allowNull: true, // Optional rakh rahe hain, bina customer name ke bhi billing ho sake
        references: {
          model: "customers",
          key: "id",
        },
      },

      cashierId: {
        type: DataTypes.UUID,
        allowNull: false, // Kis cashier ne bill banaya track karne ke liye
        references: {
          model: "users",
          key: "id",
        },
      },

      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },

      discountTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },

      taxTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },

      grandTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },

      paymentMethod: {
        type: DataTypes.ENUM("CASH", "CARD", "UPI", "MIXED"),
        allowNull: false,
        defaultValue: "CASH",
      },

      paymentStatus: {
        type: DataTypes.ENUM("PAID", "PARTIAL", "UNPAID"),
        allowNull: false,
        defaultValue: "PAID",
      },
    },
    {
      tableName: "sales",
      timestamps: true,
      paranoid: true, // Standard safe-keeping for financial audits
      indexes: [
        {
          unique: true,
          fields: ["invoiceNo"],
        },
      ],
    }
  );

  Sale.associate = (models) => {
    // Ek sale ek hi cashier (user) karega
    Sale.belongsTo(models.User, {
      foreignKey: "cashierId",
      as: "cashier",
    });

    // Ek sale ek specific customer ke liye ho sakti hai
    Sale.belongsTo(models.Customer, {
      foreignKey: "customerId",
      as: "customer",
    });

    // Ek sale ke andar bohot saare products (items) ho sakte hain
    Sale.hasMany(models.SaleItem, {
      foreignKey: "saleId",
      as: "items",
    });
  };

  return Sale;
};