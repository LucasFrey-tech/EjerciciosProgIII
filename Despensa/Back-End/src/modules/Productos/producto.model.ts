import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../Productos/db-config';
interface ProductoAttributes {
  id: number;
  nombre?: string;
  cant_almacenada?: number;
  fecha_compra?: Date;
  fecha_vec?: Date;
  categoria_id?: number;
  created_At?: Date;
  updated_At?: Date;
}

interface ProductoCreacionAttributes
  extends Optional<ProductoAttributes, 'id' | 'created_At' | 'updated_At'> {}

class Producto
  extends Model<ProductoAttributes, ProductoCreacionAttributes>
  implements ProductoAttributes
{
  public id!: number;
  public nombre?: string;
  public cant_almacenada?: number;
  public readonly fecha_compra!: Date;
  public readonly fecha_vec!: Date;
  public readonly created_At?: Date;
  public readonly updated_At?: Date;
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
        model: 'categorias', // nombre exacto de la tabla
        key: 'id',
      },
    },
  },
  {
    tableName: 'productos',
    sequelize,
  },
);

export default Producto;
