export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("sale_items", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    saleId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "sales",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // Agar main sale delete ho (soft delete/hard delete), toh items bhi clean ho jayein
    },

    productId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT", // Product delete nahi hona chahiye jab tak wo kisi bill me registered hai [cite: 40]
    },

    productNameSnapshot: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    unitPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },

    discount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },

    tax: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },

    lineTotal: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
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

  // Query performance badhane ke liye indexes [cite: 40]
  await queryInterface.addIndex("sale_items", ["saleId"], {
    name: "sale_items_saleId_index",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("sale_items");
}