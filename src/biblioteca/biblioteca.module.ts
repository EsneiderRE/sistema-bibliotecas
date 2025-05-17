import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Biblioteca } from './biblioteca.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Biblioteca])],
  providers: [],
  controllers: [],
  exports: [],
})
export class BibliotecaModule {}