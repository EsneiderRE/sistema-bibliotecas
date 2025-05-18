import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Biblioteca } from './biblioteca.entity';
import { BibliotecaService } from './biblioteca.service';

@Module({
  imports: [TypeOrmModule.forFeature([Biblioteca])],
  providers: [BibliotecaService],
  exports: [BibliotecaService],
})
export class BibliotecaModule {}