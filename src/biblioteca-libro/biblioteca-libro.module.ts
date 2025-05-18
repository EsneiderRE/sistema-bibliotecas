import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaModule } from '../biblioteca/biblioteca.module';
import { LibroModule } from '../libro/libro.module';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { Biblioteca } from '../biblioteca/biblioteca.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Biblioteca]),
    BibliotecaModule,
    LibroModule,
  ],
  providers: [BibliotecaLibroService],
  exports: [BibliotecaLibroService],
})
export class BibliotecaLibroModule {}