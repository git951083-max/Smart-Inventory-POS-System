export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("stock_movements", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    productId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    type: {
      type: Sequelize.ENUM("IN", "OUT", "RETURN", "ADJUSTMENT"),
      allowNull: false,
    },

    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    previousStock: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    newStock: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    reason: {
      type: Sequelize.ENUM("SALE", "PURCHASE", "RETURN", "DAMAGE", "MANUAL_UPDATE"),
      allowNull: false,
    },

    referenceId: {
      type: Sequelize.UUID,
      allowNull: true, // Sale ya Purchase ID yahan store hogi
    },

    createdBy: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },

    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  });

  // Fast tracking ke liye indexes [cite: 40]
  await queryInterface.addIndex("stock_movements", ["productId"], {
    name: "stock_movements_productId_index",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("stock_movements");

  // ENUM cleanup
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_stock_movements_type";');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_stock_movements_reason";');
}