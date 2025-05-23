import { Categoria } from './categoria.model';
import { CategoriaAttributes } from './categoria.type';

export class CategoriaRepository {
  async getAll(): Promise<Categoria[]> {
    return await Categoria.findAll();
  }

  async findById(id: number): Promise<Categoria | null> {
    return await Categoria.findByPk(id);
  }

  async findByName(nombre: string): Promise<Categoria | null> {
    return await Categoria.findOne({ where: { nombre } });
  }

  async create(data: CategoriaAttributes): Promise<Categoria> {
    return await Categoria.create(data);
  }

  async update(id: number, data: Partial<CategoriaAttributes>): Promise<Categoria | null> {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return null;
    return await categoria.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return false;
    await categoria.destroy();
    return true;
  }
}
