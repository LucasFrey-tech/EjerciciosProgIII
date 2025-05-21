import { Request, Response } from 'express';
import Producto from './producto.model';
import Categoria from '../Categorias/categoria.model';

interface ProductoCreateBody {
  nombre: string;
  cant_almacenada: number;
  fecha_compra: Date;
  fecha_vec: Date;
  categoriaId: number;
}

interface ProductoUpdateBody extends Partial<ProductoCreateBody> {}

export const getAllProductos = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const productos = await Producto.findAll({
      include: [
        {
          model: Categoria,
          as: 'categoria', // El alias debe coincidir con el definido en la relación
          attributes: ['id', 'nombre', 'descripcion'], // Selecciona solo los campos que necesitas
        },
      ],
    });
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
    const producto = await Producto.findByPk(req.params.id);
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

    const existente = await Producto.findOne({
      where: { nombre: body.nombre },
    });

    if (existente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un producto con ese nombre.',
      });
    }

    const categoriaExistente = await Categoria.findByPk(Number(body.categoriaId));

    console.log('Categoria buscada:', body.categoriaId);
    console.log('Categoria encontrada:', categoriaExistente);

    if (!categoriaExistente) {
      return res.status(400).json({
        success: false,
        message: 'La categoría no existe. Por favor, créala primero.',
      });
    }

    const nuevoProducto = await Producto.create({
      nombre: body.nombre,
      cant_almacenada: body.cant_almacenada,
      fecha_compra: body.fecha_compra,
      fecha_vec: body.fecha_vec,
      categoria_id: categoriaExistente.dataValues.id,
    });

    console.log('Producto creado:', JSON.stringify(nuevoProducto, null, 2));

    const productoConCategoria = await Producto.findByPk(nuevoProducto.dataValues.id, {
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nombre', 'descripcion'],
          },
        ],
      },
    );

    console.log('Respuesta enviada:', JSON.stringify(productoConCategoria?.toJSON(), null, 2));

    return res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: nuevoProducto,
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    if ((error as any).code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un producto con ese nombre.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al crear el producto',
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
    const body = req.body as ProductoUpdateBody;
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    await producto.update(body);
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
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    await producto.destroy();
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
