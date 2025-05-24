import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { ProductoRepository } from './producto.repository';
import { Producto } from './producto.model';
import { Categoria } from '../Categoria/categoria.model';

@Module({
  imports: [SequelizeModule.forFeature([Producto, Categoria])],
  controllers: [ProductoController],
  providers: [ProductoService, ProductoRepository],
})
export class ProductoModule {}
