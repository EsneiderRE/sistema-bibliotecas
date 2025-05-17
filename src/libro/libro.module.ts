import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './libro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Libro])],
  providers: [],
  controllers: [],
  exports: [],
})
export class LibroModule {}