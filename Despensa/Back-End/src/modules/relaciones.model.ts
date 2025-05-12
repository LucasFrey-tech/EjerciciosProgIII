import Producto from './Productos/producto.model';
import Categoria from './Categorias/categoria.model';

Producto.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
Categoria.hasMany(Producto, { foreignKey: 'categoria_id', as: 'productos' });

export { Producto, Categoria };