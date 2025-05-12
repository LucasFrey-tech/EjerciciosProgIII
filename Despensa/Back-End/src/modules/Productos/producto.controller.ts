import { Request, Response } from 'express';
import Producto from './producto.model';

interface ProductoCreateBody {
  nombre: string;
  cant_Almacenada: number;
  fecha_Compra: Date;
  fecha_vencimiento: Date;
  categoria_Id: number;
}

interface ProductoUpdateBody extends Partial<ProductoCreateBody> {}

export const getAllProductos = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const productos = await Producto.findAll();
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
export const getProductoById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ 
        success: false, 
        message: 'Producto no encontrado'
      });
    }
    return res.status(200).json({ success: true, data: producto });
  } catch (error) {
    console.error(`Error al obtener producto con ID ${req.params.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al obtener producto', 
      error: (error as Error).message 
    });
  }
};

// Crear un nuevo producto
export const createProducto = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body as ProductoCreateBody;
    
    // Validación básica
    if (!body.nombre) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere nombre del producto.' 
      });
    }

    const nuevoProducto = await Producto.create(body);
    return res.status(201).json({ 
      success: true, 
      message: 'Producto creado exitosamente', 
      data: nuevoProducto 
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al crear el producto', 
      error: (error as Error).message 
    });
  }
};

//Actualizar un producto existente
export const updateProducto = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body as ProductoUpdateBody;
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    await producto.update(body);
    return res.status(200).json({ 
      success: true, 
      message: 'Producto actualizado exitosamente', 
      data: producto 
    });
  } catch (error) {
    console.error(`Error al actualizar producto con ID ${req.params.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar producto', 
      error: (error as Error).message 
    });
  }
};

// Eliminar un producto
export const deleteProducto = async (req: Request, res: Response): Promise<Response> => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ 
        success: false, 
        message: 'Producto no encontrado' 
      });
    }

    await producto.destroy();
    return res.status(200).json({ 
      success: true, 
      message: 'Producto eliminado exitosamente' 
    });
  } catch (error) {
    console.error(`Error al eliminar producto con ID ${req.params.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar producto', 
      error: (error as Error).message 
    });
  }
};