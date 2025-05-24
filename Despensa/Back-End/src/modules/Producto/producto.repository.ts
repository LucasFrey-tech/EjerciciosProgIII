import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Producto } from './producto.model';
import { Categoria } from '../Categoria/categoria.model';
import { ProductoAttributes } from '../../types/producto.type';

@Injectable()
export class ProductoRepository {
  constructor(
    @InjectModel(Producto) private productoModel: typeof Producto,
    @InjectModel(Categoria) private categoriaModel: typeof Categoria,
  ) {}

  async getAll(): Promise<Producto[]> {
    return await this.productoModel.findAll({
      include: [
        {
          model: this.categoriaModel,
          as: 'categoria',
          attributes: ['id', 'nombre', 'descripcion'],
        },
      ],
    });
  }

  async findById(id: number): Promise<Producto | null>{
    return await this.productoModel.findByPk(id, {
      include: [
        {
          model: this.categoriaModel,
          as: 'categoria',
          attributes: ['id', 'nombre', 'descripcion'],
        },
      ],
    });
  }

  async findByName(nombre: string): Promise<Producto | null> {
    return await this.productoModel.findOne({ where: { nombre } });
  }

  async findCategoriaById(categoriaId: number): Promise<Categoria | null> {
    return await this.categoriaModel.findByPk(categoriaId);
  }

  async create(data: ProductoAttributes): Promise<Producto> {
    return await this.productoModel.create(data);
  }

  async findByIdWithCategoria(id: number): Promise<Producto | null> {
    return await this.productoModel.findByPk(id, {
      include: [
        {
          model: this.categoriaModel,
          as: 'categoria',
          attributes: ['id', 'nombre', 'descripcion'],
        },
      ],
    });
  }

  async update(id: number, data: Partial<ProductoAttributes>): Promise<Producto | null> {
    const producto = await this.productoModel.findByPk(id);
    if (!producto) return null;
    return await producto.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const producto = await this.productoModel.findByPk(id);
    if (!producto) return false;
    await producto.destroy();
    return true;
  }
}
