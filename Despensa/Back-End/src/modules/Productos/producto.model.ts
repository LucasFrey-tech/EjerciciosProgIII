import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './db-config';
import Categoria from '../Categoria/categoria.model';

interface ProductoAttributes {
  id: number;
  nombre?: string;
  cant_almacenada?: number;
  fecha_compra?: Date;
  fecha_vec?: Date;
  categoria_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface ProductoCreacionAttributes
  extends Optional<ProductoAttributes, 'id'> {}

class Producto
  extends Model<ProductoAttributes, ProductoCreacionAttributes>
  implements ProductoAttributes
{
  public id!: number;
  public nombre?: string;
  public cant_almacenada?: number;
  public readonly fecha_compra!: Date;
  public readonly fecha_vec!: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
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
        model: 'categoria', // nombre exacto de la tabla
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
