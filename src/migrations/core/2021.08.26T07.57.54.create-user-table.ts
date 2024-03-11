import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async () => {
    await queryInterface.createTable('user', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_login_id: {
        type: DataType.INTEGER,
        references: {
          key: 'id',
          model: 'user_login',
        },
      },
      name: {
        type: DataType.STRING,
        allowNull: false,
      },
      email: {
        type: DataType.STRING,
        allowNull: false,
      },
      phone: {
        type: DataType.STRING,
      },
      created_at: DataType.DATE,
      updated_at: DataType.DATE,
      deleted_at: DataType.DATE,
    });

    await queryInterface.addIndex('user', ['user_login_id'], { unique: true, where: { deleted_at: null } });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async () => {
    await queryInterface.removeIndex('user', ['user_login_id'], { unique: true, where: { deleted_at: null } });
    await queryInterface.dropTable('user');
  });
};
