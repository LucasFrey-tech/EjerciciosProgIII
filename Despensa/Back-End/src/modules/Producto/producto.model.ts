import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../database/db-config';
import Categoria from '../Categoria/categoria.model';
import { ProductoAttributes } from './producto.type';

export class Producto extends Model<ProductoAttributes> implements ProductoAttributes {
  public id!: number;
  public nombre!: string;
  public cant_almacenada!: number;
  public fecha_compra!: Date;
  public fecha_vec?: Date;
  public categoria_id!: number;
}

Producto.init(
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
    cant_almacenada: {
      type: DataTypes.INTEGER,
    },
    fecha_compra: {
      type: DataTypes.DATE,
    },
    fecha_vec: {
      type: DataTypes.DATE,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Categoria,
        key: 'id',
      },
    },
  },
  {
    tableName: 'producto',
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default Producto;
