import { Request, Response } from 'express';
import { CategoriaRepository } from './categoria.repository';
import { CategoriaService } from './categoria.service';

const categoriaService = new CategoriaService(new CategoriaRepository());

interface CategoriaCreateBody {
  id: number;
  nombre: string;
  descripcion: string;
}

export const getAllCategorias = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const categorias = await categoriaService.getAllCategorias();
    return res.status(200).json({ success: true, data: categorias });
  } catch (error) {
    console.error('Error al obtener los categorias:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los categorias',
      error: (error as Error).message,
    });
  }
};

// Obtener un categoria por ID
export const getCategoriaById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const categoria = await categoriaService.getCategoriaById(Number(req.params.id));
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoria no encontrado',
      });
    }
    return res.status(200).json({ success: true, data: categoria });
  } catch (error) {
    console.error(
      `Error al obtener la categoria con ID ${req.params.id}:`,
      error,
    );
    return res.status(500).json({
      success: false,
      message: 'Error al obtener categoria',
      error: (error as Error).message,
    });
  }
};

// Crear un nuevo categoria
export const createCategoria = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const body = req.body as CategoriaCreateBody;

    // Validación básica
    if (!body.nombre) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere nombre del categoria.',
      });
    }

    const nuevaCategoria = await categoriaService.createCategoria(body);
    return res.status(201).json({
      success: true,
      message: 'Categoria creado exitosamente',
      data: nuevaCategoria,
    });
  } catch (error) {
    console.error('Error al crear el categoria:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el categoria',
      error: (error as Error).message,
    });
  }
};

//Actualizar un categoria existente
export const updateCategoria = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const body = req.body as CategoriaCreateBody;
    const categoria = await categoriaService.updateCategoria(Number(req.params.id), body);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoria no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Categoria actualizado exitosamente',
      data: categoria,
    });
  } catch (error) {
    console.error(
      `Error al actualizar categoria con ID ${req.params.id}:`,
      error,
    );
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar categoria',
      error: (error as Error).message,
    });
  }
};

// Eliminar un categoria
export const deleteCategoria = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const categoria = await categoriaService.deleteCategoria(Number(req.params.id));
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoria no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Categoria eliminado exitosamente',
    });
  } catch (error) {
    console.error(
      `Error al eliminar categoria con ID ${req.params.id}:`,
      error,
    );
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar categoria',
      error: (error as Error).message,
    });
  }
};
