import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async () => {
    await queryInterface.createTable('user_login', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataType.STRING,
        allowNull: false,
      },
      password: {
        type: DataType.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataType.BOOLEAN,
        defaultValue: false,
      },
      created_at: DataType.DATE,
      updated_at: DataType.DATE,
      deleted_at: DataType.DATE,
    });

    await queryInterface.addIndex('user_login', ['is_active', 'username'], { where: { deleted_at: null } });
    await queryInterface.addIndex('user_login', ['username'], { where: { deleted_at: null }, unique: true });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async () => {
    await queryInterface.removeIndex('user_login', ['username'], { where: { deleted_at: null }, unique: true });
    await queryInterface.removeIndex('user_login', ['is_active', 'username'], { where: { deleted_at: null } });
    await queryInterface.dropTable('user_login');
  });
};
