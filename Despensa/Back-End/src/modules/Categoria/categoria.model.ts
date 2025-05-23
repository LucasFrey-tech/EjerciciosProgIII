import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../database/db-config';
import { CategoriaAttributes } from './categoria.type';

export class Categoria extends Model<CategoriaAttributes> implements CategoriaAttributes {
  public id!: number;
  public nombre!: string;
  public descripcion!: string;
}

Categoria.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'categoria',
    sequelize,
    timestamps: false,
  },
);

export default Categoria;
