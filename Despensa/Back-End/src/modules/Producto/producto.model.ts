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
