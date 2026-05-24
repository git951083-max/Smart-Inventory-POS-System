// migrations/20260520001000-create-products-table.js

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("products", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    sku: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },

    barcode: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },

    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    brand: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    unit: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdBy: {
  type: Sequelize.UUID,
  allowNull: true,
  references: {
    model: "users",
    key: "id",
  },
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
},

    categoryId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    purchasePrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },

    sellingPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },

    stockQty: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },

    lowStockLimit: {
      type: Sequelize.INTEGER,
      defaultValue: 5,
    },

    taxRate: {
      type: Sequelize.DECIMAL(5, 2),
      defaultValue: 0,
    },

    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE", "DISCONTINUED"),
      defaultValue: "ACTIVE",
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
    },
  });

  // Indexes
  await queryInterface.addIndex("products", ["sku"], {
    unique: true,
    name: "products_sku_unique_index",
  });

  await queryInterface.addIndex("products", ["barcode"], {
    unique: true,
    name: "products_barcode_unique_index",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("products");

  // ENUM cleanup (important for PostgreSQL)
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_products_status";'
  );
}