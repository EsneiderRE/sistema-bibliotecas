import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Libro } from '../libro/libro.entity';

@Entity()
export class Biblioteca {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  ciudad: string;

  @Column()
  horarioAtencion: string;

  @OneToMany(() => Libro, libro => libro.biblioteca)
  libros: Libro[];
}