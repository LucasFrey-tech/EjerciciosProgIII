import { NestFactory } from '@nestjs/core';
import { AppModule } from '../database/app.module';
import { testConnection } from '../database/db-config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configurar prefijo global para las rutas
  app.setGlobalPrefix('api');

  // Configurar pipes globales para validación
  app.useGlobalPipes(new ValidationPipe());

  // Probar conexión a la base de datos
  await testConnection();

  // Iniciar servidor
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Servidor corriendo en http://localhost:${port}`);
}

bootstrap();
