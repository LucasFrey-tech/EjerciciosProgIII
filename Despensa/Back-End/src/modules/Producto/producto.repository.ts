import { Categoria } from '../relaciones.model';
import { Producto } from './producto.model';
import { ProductoAttributes } from './producto.type';

export class ProductoRepository {
  async getAll(): Promise<Producto[]> {
    return await Producto.findAll({
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre', 'descripcion'],
        },
      ],
    });
  }

  async findById(id: number): Promise<Producto | null>{
    return await Producto.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre', 'descripcion'],
        },
      ],
    });
  }

  async findByName(nombre: string): Promise<Producto | null> {
    return await Producto.findOne({ where: { nombre } });
  }

  async findCategoriaById(categoriaId: number): Promise<Categoria | null> {
    return await Categoria.findByPk(categoriaId);
  }

  async create(data: ProductoAttributes): Promise<Producto> {
    return await Producto.create(data);
  }

  async findByIdWithCategoria(id: number): Promise<Producto | null> {
    return await Producto.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre', 'descripcion'],
        },
      ],
    });
  }

  async update(id: number, data: Partial<ProductoAttributes>): Promise<Producto | null> {
    const producto = await Producto.findByPk(id);
    if (!producto) return null;
    return await producto.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const producto = await Producto.findByPk(id);
    if (!producto) return false;
    await producto.destroy();
    return true;
  }
}
