import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreationAttributes, UniqueConstraintError } from 'sequelize';
import { Producto } from './producto.model';

interface ProductoCreateBody extends CreationAttributes<Producto> {
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
      throw new HttpException(`Error al obtener los productos: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException(`Error al obtener producto con ID ${id}: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createProducto(@Body() body: ProductoCreateBody) {
    try {
      if (!body.nombre) {
        throw new BadRequestException('Se requiere nombre del producto.');
      }
      const nuevoProducto = await this.productoService.createProducto(body);
      return {
        success: true,
        message: 'Producto creado exitosamente',
        data: nuevoProducto,
      };
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new BadRequestException('Ya existe un producto con ese nombre.');
      }
      throw new HttpException(`Error al crear el producto: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException(`Error al actualizar producto con ID ${id}: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException(`Error al eliminar producto con ID ${id}: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
