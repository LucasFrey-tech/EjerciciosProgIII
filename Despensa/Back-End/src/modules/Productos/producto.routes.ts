import express from 'express';
import * as productosController from './producto.controller';

const router = express.Router();

router.get('/', productosController.getAllProductos);

export default router;
