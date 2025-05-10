import { Router } from 'express'; // Importa Router directamente
import * as productosController from './producto.controller';

const router = Router(); // Usa Router sin necesidad de express.Router()

router.get('/', productosController.getAllProductos);

export default router;
