import { Router } from 'express';
import * as productosController from './producto.controller';

const router = Router();

router.get('/', productosController.getAllProductos);
router.get('/:id', productosController.getProductoById);
router.post('/', productosController.createProducto);
router.put('/:id', productosController.updateProducto);
router.delete('/:id', productosController.deleteProducto);

export default router;
