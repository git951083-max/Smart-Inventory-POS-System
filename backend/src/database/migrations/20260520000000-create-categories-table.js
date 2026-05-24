// migrations/20260520000000-create-categories-table.js

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("categories", {
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

    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
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
  });

  // optional index
  await queryInterface.addIndex("categories", ["name"], {
    name: "categories_name_index",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("categories");

  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_categories_status";'
  );
}