import { Request, Response } from 'express';
import * as express from 'express';
import { testConnection } from './modules/Productos/db-config';
import productoRoutes from './modules/Productos/producto.routes';
import * as cors from 'cors';

// Tipos para el manejo de errores
interface AppError extends Error {
  status?: number;
}

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Probar conexión a la base de datos
testConnection();

// Ruta base
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Bienvenido a la API de la despensa',
    endpoints: {
      productos: '/api/productos',
    },
  });
});

// Rutas de la API
app.use('/api/productos', productoRoutes);

// Middleware para manejar rutas no existentes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Middleware para manejar errores
app.use((err: AppError, req: Request, res: Response) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: 'Error en el servidor',
    error: err.message,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Para manejo adecuado de tipos en TypeScript para exports
export default app;
