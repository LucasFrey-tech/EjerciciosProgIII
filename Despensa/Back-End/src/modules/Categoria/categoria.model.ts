/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Producto } from '../Producto/producto.model';
@Table({ tableName: 'Categorias', timestamps: false })
export class Categoria extends Model<Categoria> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nombre: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  descripcion: string;

  @HasMany(() => Producto)
  productos: Producto[];
}
