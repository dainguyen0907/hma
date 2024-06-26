'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_payment_method: {
        type: Sequelize.INTEGER
      },
      id_customer: {
        type: Sequelize.INTEGER
      },
      invoice_code:{
        type: Sequelize.STRING(15)
      },
      invoice_reception_name:{
        type: Sequelize.STRING(50),
      },
      invoice_receipt_date: {
        type: Sequelize.DATE
      },
      invoice_payment_date: {
        type: Sequelize.DATE
      },
      invoice_discount:{
        type:Sequelize.BIGINT
      },
      invoice_deposit: {
        type: Sequelize.BIGINT
      },
      invoice_total_payment: {
        type: Sequelize.BIGINT
      },
      invoice_note:{
        type:Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Invoices');
  }
};