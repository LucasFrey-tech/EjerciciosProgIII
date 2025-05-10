import { Request, Response } from 'express';
import Producto from '../Productos/producto.model';

interface ProductoCreateBody {
  nombre: string;
  cant_Almacenada: number;
  fecha_Compra: Date;
  fecha_vencimiento: Date;
  categoria_Id: number;
}

//interface productoUpdateBody extends Partial<ProductoCreateBody> {}

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
      massage: 'Error al obtener los productos',
      error: (error as Error).message,
    });
  }
};
