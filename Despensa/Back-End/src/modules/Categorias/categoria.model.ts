import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../database/db-config';

interface CategoriaAttributes {
  id: number;
  nombre?: string;
  descripcion?: string;
}

interface CategoriaCreacionAttributes
  extends Optional<CategoriaAttributes, 'id'> {}

class Categoria
  extends Model<CategoriaAttributes, CategoriaCreacionAttributes>
  implements CategoriaAttributes
{
  public id!: number;
  public nombre?: string;
  public descripcion?: string;
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
