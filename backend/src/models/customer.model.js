// models/Customer.model.js

export default (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
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
          len: [2, 100],
        },
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      pincode: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      gstin: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },

      totalPurchases: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "customers",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          fields: ["email"],
        },
        {
          fields: ["phone"],
        },
      ],
    }
  );

  Customer.associate = (models) => {
    // Ek customer ke paas multiple sales ho sakte hain
    Customer.hasMany(models.Sale, {
      foreignKey: "customerId",
      as: "sales",
    });
  };

  return Customer;
};
