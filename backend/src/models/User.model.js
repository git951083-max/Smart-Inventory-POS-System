// models/User.model.js

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
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
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      passwordHash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      role: {
        type: DataTypes.ENUM(
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "EMPLOYEE",
          "USER"
        ),
        allowNull: false,
        defaultValue: "USER",
      },

      status: {
        type: DataTypes.ENUM(
          "ACTIVE",
          "INACTIVE",
          "SUSPENDED"
        ),
        allowNull: false,
        defaultValue: "ACTIVE",
      },
    },
    {
      tableName: "users",

      timestamps: true,

      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
      ],
    }
  );

  // Associations
  User.associate = (models) => {
    // Example:
    // User.hasMany(models.Product, {
    //   foreignKey: "createdBy",
    // });
  };

  return User;
};