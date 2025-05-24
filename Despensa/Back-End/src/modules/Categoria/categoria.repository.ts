import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Categoria } from './categoria.model';
import { CategoriaAttributes } from '../../types/categoria.type';

@Injectable()
export class CategoriaRepository {
  constructor(
    @InjectModel(Categoria) private categoriaModel: typeof Categoria,
  ) {}

  async getAll(): Promise<Categoria[]> {
    return await this.categoriaModel.findAll();
  }

  async findById(id: number): Promise<Categoria | null> {
    return await this.categoriaModel.findByPk(id);
  }

  async findByName(nombre: string): Promise<Categoria | null> {
    return await this.categoriaModel.findOne({ where: { nombre } });
  }

  async create(data: CategoriaAttributes): Promise<Categoria> {
    return await this.categoriaModel.create(data);
  }

  async update(id: number, data: Partial<CategoriaAttributes>): Promise<Categoria | null> {
    const categoria = await this.categoriaModel.findByPk(id);
    if (!categoria) return null;
    return await categoria.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const categoria = await this.categoriaModel.findByPk(id);
    if (!categoria) return false;
    await categoria.destroy();
    return true;
  }
}
