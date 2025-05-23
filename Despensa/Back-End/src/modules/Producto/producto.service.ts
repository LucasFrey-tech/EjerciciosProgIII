import { error } from 'console';
import { ProductoRepository } from './producto.repository';
import { ProductoAttributes } from './producto.type';

export class ProductoService {
  constructor(private repository: ProductoRepository) {}

  // Validaciones
  private async validateNombreRequerido(nombre: string): Promise<void> {
    if (!nombre) {
      throw new Error('Se requiere nombre del producto.');
    }
    return Promise.resolve();
  }

  private async validateNombreUnico(nombre: string, id?: number): Promise<void> {
    const existente = await this.repository.findByName(nombre);
    if (existente && (!id || existente.id !== id)) {
      throw new Error('Ya existe un producto con ese nombre.');
    }
  }

  private async validateCategoriaExistente(categoriaId: number): Promise<void> {
    const categoriaExistente = await this.repository.findCategoriaById(categoriaId);
    if (!categoriaExistente) {
      throw new Error('La categoría no existe. Por favor, créala primero.');
    }
  }

  private async validateCantAlmacenado(cant: number): Promise<void> {
    if (cant <= 0) {
      throw new Error('La cantidad no puede ser negativa.');
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

    // Crear producto
    const nuevoProducto = await this.repository.create(data);

    // Obtener producto con categoría para la respuesta
    /*const productoConCategoria = await this.repository.findByIdWithCategoria(nuevoProducto.id!);
    if (!productoConCategoria) {
      throw new Error('Error al obtener el producto creado.');
    }*/

    return nuevoProducto;
  }

  async updateProducto(id: number, data: Partial<ProductoAttributes>): Promise<ProductoAttributes | null> {
    // Validación opcional: si se envía nombre, verificar que no exista otro producto con ese nombre
    if (data.nombre) {
      await this.validateNombreUnico(data.nombre, id);
    }

    // Validación opcional: si se envía categoriaId, verificar que exista
    if (data.categoria_id) {
      await this.validateCategoriaExistente(data.categoria_id);
    }

    return await this.repository.update(id, data);
  }

  async deleteProducto(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
