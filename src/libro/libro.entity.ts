import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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


  @ManyToOne(() => Biblioteca, biblioteca => biblioteca.libros)
  biblioteca: Biblioteca;
}