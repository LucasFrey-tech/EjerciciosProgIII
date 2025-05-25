import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductoModule } from '../src/modules/Producto/producto.module';
import { Producto } from '../src/modules/Producto/producto.model';
import { Categoria } from '../src/modules/Categoria/categoria.model';
import { sequelizeOptions } from './db-config';
import { CategoriaModule } from 'src/modules/Categoria/categoria.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        ...sequelizeOptions,
        models: [Producto, Categoria],
        autoLoadModels: true,
        synchronize: false,
      }),
    }),
    ProductoModule,
    CategoriaModule,
  ],
})
export class AppModule {}
