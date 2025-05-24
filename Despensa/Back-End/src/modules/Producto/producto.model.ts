/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import { Table,  Model , ForeignKey, DataType, Column, BelongsTo} from 'sequelize-typescript';
import { Categoria } from '../Categoria/categoria.model';

@Table({ tableName: 'Producto', timestamps: false })
export class Producto extends Model<Producto> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nombre: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cant_almacenada: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  fecha_compra: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  fecha_vec: Date;

  @ForeignKey(() => Categoria)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoria_id: number;

  @BelongsTo(() => Categoria)
  categoria: Categoria;
}
/*
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
*/
export default Producto;
