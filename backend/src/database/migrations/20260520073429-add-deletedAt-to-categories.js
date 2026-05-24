export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("categories", "deletedAt", {
    type: Sequelize.DATE,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("categories", "deletedAt");
}