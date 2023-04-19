'use strict';

import { DataTypes, QueryInterface, Sequelize } from "sequelize";


module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Listings',
        'Origin',
        {
          type: DataTypes.STRING,
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Listings', 'Origin', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};