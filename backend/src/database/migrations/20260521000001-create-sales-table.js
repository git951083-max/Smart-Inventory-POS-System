export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("sales", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    invoiceNo: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    customerId: {
      type: Sequelize.UUID,
      allowNull: true,
      // Note: Agar abhi customers table nahi banayi hai, toh foreign key reference crash ho sakta hai.
      // Agar table nahi hai, toh abhi ke liye references wala block hata dena ya pehle customers table banana.
    },

    cashierId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT", // Cashier user delete na ho sake agar uske bills hain [cite: 40]
    },

    subtotal: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },

    discountTotal: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },

    taxTotal: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },

    grandTotal: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },

    paymentMethod: {
      type: Sequelize.ENUM("CASH", "CARD", "UPI", "MIXED"),
      allowNull: false,
      defaultValue: "CASH",
    },

    paymentStatus: {
      type: Sequelize.ENUM("PAID", "PARTIAL", "UNPAID"),
      allowNull: false,
      defaultValue: "PAID",
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

    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true, // Paranoid (soft delete) support ke liye [cite: 40]
    }
  });

  // Invoice Number Index [cite: 40]
  await queryInterface.addIndex("sales", ["invoiceNo"], {
    unique: true,
    name: "sales_invoiceNo_unique_index",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("sales");

  // ENUM cleanup
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sales_paymentMethod";');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sales_paymentStatus";');
}