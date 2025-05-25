import { CreationAttributes } from 'sequelize';
import { Producto } from 'src/modules/Producto/producto.model';

export interface ProductoAttributes extends CreationAttributes<Producto> {
  id?: number;
  nombre: string;
  cant_almacenada: number;
  fecha_compra: Date;
  fecha_vec: Date;
  categoria_id: number;
}
