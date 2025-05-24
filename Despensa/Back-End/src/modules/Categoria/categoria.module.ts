import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { CategoriaRepository } from './categoria.repository';
import { Categoria } from './categoria.model';

@Module({
  imports: [SequelizeModule.forFeature([Categoria])],
  controllers: [CategoriaController],
  providers: [CategoriaService, CategoriaRepository],
})
export class CategoriaModule {}
