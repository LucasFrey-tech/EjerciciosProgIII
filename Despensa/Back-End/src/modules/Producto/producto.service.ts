import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductoRepository } from './producto.repository';
import { ProductoAttributes } from '../../types/producto.type';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class ProductoService {
  constructor(private repository: ProductoRepository) {}

  private async validateNombreRequerido(nombre: string): Promise<void> {
    if (!nombre) {
      throw new BadRequestException('Se requiere nombre del producto.');
    }
    return Promise.resolve();
  }

  private async validateNombreUnico(nombre: string, id?: number): Promise<void> {
    const existente = await this.repository.findByName(nombre);
    if (existente && (!id || existente.id !== id)) {
      throw new BadRequestException('Ya existe un producto con ese nombre.');
    }
  }

  private async validateCategoriaExistente(categoriaId: number): Promise<void> {
    const categoriaExistente = await this.repository.findCategoriaById(categoriaId);
    if (!categoriaExistente) {
      throw new BadRequestException('La categoría no existe. Por favor, créala primero.');
    }
  }

  private async validateCantAlmacenado(cant: number): Promise<void> {
    if (cant <= 0) {
      throw new BadRequestException('La cantidad no puede ser negativa.');
    }
    return Promise.resolve();
  }

  async getAllProductos(): Promise<ProductoAttributes[]> {
    return await this.repository.getAll();
  }

  async getProductoById(id: number): Promise<ProductoAttributes | null> {
    return await this.repository.findById(id);
  }

  async createProducto(data: ProductoAttributes): Promise<ProductoAttributes> {
    await this.validateNombreRequerido(data.nombre);
    await this.validateNombreUnico(data.nombre);
    await this.validateCategoriaExistente(data.categoria_id);
    await this.validateCantAlmacenado(data.cant_almacenada);

    try {
      const nuevoProducto = await this.repository.create(data);
      return nuevoProducto;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new BadRequestException('Ya existe un producto con ese nombre.');
      }
      throw error;
    }
  }

  async updateProducto(id: number, data: Partial<ProductoAttributes>): Promise<ProductoAttributes | null> {
    if (data.nombre) {
      await this.validateNombreUnico(data.nombre, id);
    }
    if (data.categoria_id) {
      await this.validateCategoriaExistente(data.categoria_id);
    }
    return await this.repository.update(id, data);
  }

  async deleteProducto(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
