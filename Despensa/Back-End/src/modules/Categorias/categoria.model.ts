import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../database/db-config';

interface CategoriaAttributes {
  id: number;
  nombre?: string;
  descripcion?: string;
  created_At?: Date;
  updated_At?: Date;
}

interface CategoriaCreacionAttributes
  extends Optional<CategoriaAttributes, 'id' | 'created_At' | 'updated_At'> {}

class Categoria
  extends Model<CategoriaAttributes, CategoriaCreacionAttributes>
  implements CategoriaAttributes
{
  public id!: number;
  public nombre?: string;
  public descripcion?: string;
  public readonly created_At?: Date;
  public readonly updated_At?: Date;
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
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'categoria',
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default Categoria;
