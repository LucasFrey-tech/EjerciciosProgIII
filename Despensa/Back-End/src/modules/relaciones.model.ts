import Producto from './Producto/producto.model';
import Categoria from './Categoria/categoria.model';

Producto.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
Categoria.hasMany(Producto, { foreignKey: 'categoria_id', as: 'productos' });

export { Producto, Categoria };
