import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductoModule } from '../src/modules/Producto/producto.module';
import { Producto } from '../src/modules/Producto/producto.model';
import { Categoria } from '../src/modules/Categoria/categoria.model';
import { sequelize } from './db-config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        sequelize,
        models: [Producto, Categoria],
        autoLoadModels: true,
        synchronize: false,
      }),
    }),
    ProductoModule,
  ],
})
export class AppModule {}
