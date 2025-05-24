import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { UniqueConstraintError } from 'sequelize';

interface ProductoCreateBody {
  nombre: string;
  cant_almacenada: number;
  fecha_compra: Date;
  fecha_vec: Date;
  categoria_id: number;
}

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  async getAllProductos() {
    try {
      const productos = await this.productoService.getAllProductos();
      return { success: true, data: productos };
    } catch (error) {
      throw new HttpStatus(HttpStatus.INTERNAL_SERVER_ERROR, `Error al obtener los productos: ${(error as Error).message}`);
    }
  }

  @Get(':id')
  async getProductoById(@Param('id') id: string) {
    try {
      const producto = await this.productoService.getProductoById(Number(id));
      if (!producto) {
        throw new NotFoundException('Producto no encontrado');
      }
      return { success: true, data: producto };
    } catch (error) {
      throw new HttpStatus(HttpStatus.INTERNAL_SERVER_ERROR, `Error al obtener producto con ID ${id}: ${(error as Error).message}`);
    }
  }

  @Post()
  async createProducto(@Body() body: ProductoCreateBody) {
    try {
      if (!body.nombre) {
        throw new BadRequestException('Se requiere nombre del producto.');
      }
      const nuevoProducto = await this.productoService.createProducto({
        nombre: body.nombre,
        cant_almacenada: body.cant_almacenada,
        fecha_compra: body.fecha_compra,
        fecha_vec: body.fecha_vec,
        categoria_id: body.categoria_id,
      });
      return {
        success: true,
        message: 'Producto creado exitosamente',
        data: nuevoProducto,
      };
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new BadRequestException('Ya existe un producto con ese nombre.');
      }
      throw new HttpStatus(HttpStatus.INTERNAL_SERVER_ERROR, `Error al crear el producto: ${(error as Error).message}`);
    }
  }

  @Put(':id')
  async updateProducto(@Param('id') id: string, @Body() body: ProductoCreateBody) {
    try {
      const producto = await this.productoService.updateProducto(Number(id), body);
      if (!producto) {
        throw new NotFoundException('Producto no encontrado');
      }
      return {
        success: true,
        message: 'Producto actualizado exitosamente',
        data: producto,
      };
    } catch (error) {
      throw new HttpStatus(HttpStatus.INTERNAL_SERVER_ERROR, `Error al actualizar producto con ID ${id}: ${(error as Error).message}`);
    }
  }

  @Delete(':id')
  async deleteProducto(@Param('id') id: string) {
    try {
      const success = await this.productoService.deleteProducto(Number(id));
      if (!success) {
        throw new NotFoundException('Producto no encontrado');
      }
      return {
        success: true,
        message: 'Producto eliminado exitosamente',
      };
    } catch (error) {
      throw new HttpStatus(HttpStatus.INTERNAL_SERVER_ERROR, `Error al eliminar producto con ID ${id}: ${(error as Error).message}`);
    }
  }
}
