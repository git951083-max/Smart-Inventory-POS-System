export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('customers', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    pincode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    gstin: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    totalPurchases: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('customers');
}
