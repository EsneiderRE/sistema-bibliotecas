import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Biblioteca } from '../biblioteca/biblioteca.entity';

@Entity()
export class Libro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  autor: string;

  @Column()
  fechaPublicacion: Date;

  @Column({ unique: true })
  isbn: string;

  @ManyToMany(() => Biblioteca, biblioteca => biblioteca.libros)
  bibliotecas: Biblioteca[];
}