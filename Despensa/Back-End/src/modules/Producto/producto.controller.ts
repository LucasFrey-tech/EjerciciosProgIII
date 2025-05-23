import { Request, Response } from 'express';
import { ProductoRepository } from './producto.repository';
import { ProductoService } from './producto.service';
import { UniqueConstraintError } from 'sequelize';

const productoService = new ProductoService(new ProductoRepository());

interface ProductoCreateBody {
  nombre: string;
  cant_almacenada: number;
  fecha_compra: Date;
  fecha_vec: Date;
  categoriaId: number;
}

export const getAllProductos = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const productos = await productoService.getAllProductos();
    return res.status(200).json({ success: true, data: productos });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los productos',
      error: (error as Error).message,
    });
  }
};

// Obtener un producto por ID
export const getProductoById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const producto = await productoService.getProductoById(Number(req.params.id));
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }
    return res.status(200).json({ success: true, data: producto });
  } catch (error) {
    console.error(`Error al obtener producto con ID ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: (error as Error).message,
    });
  }
};

// Crear un nuevo producto
export const createProducto = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const body = req.body as ProductoCreateBody;
    console.log('Cuerpo recibido:', JSON.stringify(body, null, 2));
    // Validación básica
    if (!body.nombre) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere nombre del producto.',
      });
    }

    const nuevoProducto = await productoService.createProducto({
      nombre: body.nombre,
      cant_almacenada: body.cant_almacenada,
      fecha_compra: body.fecha_compra,
      fecha_vec: body.fecha_vec,
      categoria_id: body.categoriaId,
    });

    return res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: nuevoProducto,
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un producto con ese nombre.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al crear el producto:',
      error: (error as Error).message,
    });
  }
};

//Actualizar un producto existente
export const updateProducto = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const body = req.body as ProductoCreateBody;
    const producto = await productoService.updateProducto(Number(req.params.id), body);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: producto,
    });
  } catch (error) {
    console.error(
      `Error al actualizar producto con ID ${req.params.id}:`,
      error,
    );
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: (error as Error).message,
    });
  }
};

// Eliminar un producto
export const deleteProducto = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const success = await productoService.deleteProducto(Number(req.params.id));
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente',
    });
  } catch (error) {
    console.error(`Error al eliminar producto con ID ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: (error as Error).message,
    });
  }
};
