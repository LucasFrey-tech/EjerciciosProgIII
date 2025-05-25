import { CreationAttributes } from 'sequelize';
import { Categoria } from 'src/modules/Categoria/categoria.model';

export interface CategoriaAttributes extends CreationAttributes<Categoria> {
  id?: number;
  nombre: string;
  descripcion: string;
}
