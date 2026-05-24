export default (sequelize, DataTypes) => {
  const StockMovement = sequelize.define(
    "StockMovement",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },

      type: {
        type: DataTypes.ENUM("IN", "OUT", "RETURN", "ADJUSTMENT"),
        allowNull: false, // Stock andar aaya (Purchase/Return) ya bhaar gaya (Sale/Damage)
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },

      previousStock: {
        type: DataTypes.INTEGER,
        allowNull: false, // Badlav se pehle kitna stock tha (Audit ke liye)
      },

      newStock: {
        type: DataTypes.INTEGER,
        allowNull: false, // Badlav ke baad kitna stock bacha
      },

      reason: {
        type: DataTypes.ENUM("SALE", "PURCHASE", "RETURN", "DAMAGE", "MANUAL_UPDATE"),
        allowNull: false, // Kis wajah se stock badla
      },

      referenceId: {
        type: DataTypes.UUID,
        allowNull: true, // Agar SALE ki wajah se hua, toh yahan Sale_ID store hogi
      },

      createdBy: {
        type: DataTypes.UUID,
        allowNull: false, // Kis user/staff ne ye action trigger kiya
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "stock_movements",
      timestamps: true, // Kis time stock change hua, automatic pata chal jayega
    }
  );

  StockMovement.associate = (models) => {
    // Har movement kisi na kisi product ka hoga
    StockMovement.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });

    // Har movement kisi na kisi user ne kiya hoga
    StockMovement.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "user",
    });
  };

  return StockMovement;
};