// migrations/20260518000000-create-users-table.js

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
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

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    passwordHash: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    role: {
      type: Sequelize.ENUM(
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
      type: Sequelize.ENUM(
        "ACTIVE",
        "INACTIVE",
        "SUSPENDED"
      ),
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

  // Email index
  await queryInterface.addIndex("users", ["email"], {
    unique: true,
    name: "users_email_unique_index",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("users");

  // ENUM cleanup (PostgreSQL)
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_users_role";'
  );

  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_users_status";'
  );
}