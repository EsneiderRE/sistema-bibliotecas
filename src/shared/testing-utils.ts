import { TypeOrmModule } from '@nestjs/typeorm';
import { Biblioteca } from '../biblioteca/biblioteca.entity';
import { Libro } from '../libro/libro.entity';


const entities = [
  Biblioteca,
  Libro,
];

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: entities,
    synchronize: true,
    logging: false
  }),
  TypeOrmModule.forFeature(entities),
];