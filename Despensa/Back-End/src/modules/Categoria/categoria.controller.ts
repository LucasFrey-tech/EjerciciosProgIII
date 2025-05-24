import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { CategoriaService } from './categoria.service';

interface CategoriaCreateBody {
  id: number;
  nombre: string;
  descripcion: string;
}

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Get()
  async getAllCategorias() {
    try {
      const categorias = await this.categoriaService.getAllCategorias();
      return { success: true, data: categorias };
    } catch (error) {
      throw new NotFoundException(`Error al obtener las categorías: ${(error as Error).message}`);
    }
  }

  // Obtener un categoria por ID
  @Get(':id')
  async getCategoriaById(@Param('id') id: string) {
    try {
      const categoria = await this.categoriaService.getCategoriaById(Number(id));
      if (!categoria) {
        throw new NotFoundException('Categoría no encontrada');
      }
      return { success: true, data: categoria };
    } catch (error) {
      throw new NotFoundException(`Error al obtener la categoría con ID ${id}: ${(error as Error).message}`);
    }
  }

  // Crear un nuevo categoria
  @Post()
  async createCategoria(@Body() body: CategoriaCreateBody) {
    try {
      if (!body.nombre) {
        throw new BadRequestException('Se requiere nombre de la categoría.');
      }
      const nuevaCategoria = await this.categoriaService.createCategoria(body);
      return {
        success: true,
        message: 'Categoría creada exitosamente',
        data: nuevaCategoria,
      };
    } catch (error) {
      throw new BadRequestException(`Error al crear la categoría: ${(error as Error).message}`);
    }
  }

  //Actualizar un categoria existente
  @Put(':id')
  async updateCategoria(@Param('id') id: string, @Body() body: CategoriaCreateBody) {
    try {
      const categoria = await this.categoriaService.updateCategoria(Number(id), body);
      if (!categoria) {
        throw new NotFoundException('Categoría no encontrada');
      }
      return {
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: categoria,
      };
    } catch (error) {
      throw new NotFoundException(`Error al actualizar la categoría con ID ${id}: ${(error as Error).message}`);
    }
  }

  // Eliminar un categoria
  @Delete(':id')
  async deleteCategoria(@Param('id') id: string) {
    try {
      const success = await this.categoriaService.deleteCategoria(Number(id));
      if (!success) {
        throw new NotFoundException('Categoría no encontrada');
      }
      return {
        success: true,
        message: 'Categoría eliminada exitosamente',
      };
    } catch (error) {
      throw new NotFoundException(`Error al eliminar la categoría con ID ${id}: ${(error as Error).message}`);
    }
  }
}
