import { Injectable, BadRequestException } from '@nestjs/common';
import { CategoriaRepository } from './categoria.repository';
import { CategoriaAttributes } from '../../types/categoria.type';
import { Producto } from '../Producto/producto.model';

@Injectable()
export class CategoriaService {
  constructor(private repository: CategoriaRepository) {}

  // Validaciones
  private async validateCamposRequeridos(nombre: string, descripcion: string): Promise<void> {
    if (!nombre || !descripcion) {
      throw new BadRequestException('Se requiere nombre y descripción para la categoría.');
    }
    return Promise.resolve();
  }

  private async validateNombreUnico(nombre: string, id?: number): Promise<void> {
    const existente = await this.repository.findByName(nombre);
    if (existente && (!id || existente.id !== id)) {
      throw new BadRequestException('Ya existe una categoría con ese nombre.');
    }
  }

  private async validateNoProductosAsignados(categoriaId: number): Promise<void> {
    const productos = await Producto.findAll({ where: { categoria_id: categoriaId } });
    if (productos.length > 0) {
      throw new BadRequestException('No se puede eliminar la categoría porque tiene productos asociados.');
    }
  }

  async getAllCategorias(): Promise<CategoriaAttributes[]> {
    return await this.repository.getAll();
  }

  async getCategoriaById(id: number): Promise<CategoriaAttributes | null> {
    return await this.repository.findById(id);
  }

  async createCategoria(data: CategoriaAttributes): Promise<CategoriaAttributes> {
    await this.validateCamposRequeridos(data.nombre, data.descripcion);
    await this.validateNombreUnico(data.nombre);

    return await this.repository.create(data);
  }

  async updateCategoria(id: number, data: Partial<CategoriaAttributes>): Promise<CategoriaAttributes | null> {
    if (data.nombre) {
      await this.validateNombreUnico(data.nombre, id);
    }
    if (data.nombre || data.descripcion) {
      await this.validateCamposRequeridos(data.nombre || "", data.descripcion || "");
    }

    return await this.repository.update(id, data);
  }

  async deleteCategoria(id: number): Promise<boolean> {
    await this.validateNoProductosAsignados(id);

    return await this.repository.delete(id);
  }
}
