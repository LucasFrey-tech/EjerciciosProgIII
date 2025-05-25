import { Sequelize } from 'sequelize';
import { SequelizeOptions } from 'sequelize-typescript';

const sequelizeOptions: SequelizeOptions = {
  database: process.env.DB_NAME || 'despensa',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const sequelize = new Sequelize(sequelizeOptions);

const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente con PostgreSQL.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

export { sequelize, testConnection, sequelizeOptions };
