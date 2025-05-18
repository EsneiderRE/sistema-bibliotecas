import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './libro.entity';
import { LibroService } from './libro.service';

@Module({
  imports: [TypeOrmModule.forFeature([Libro])],
  providers: [LibroService], 
  controllers: [],
  exports: [LibroService]
})
export class LibroModule {}