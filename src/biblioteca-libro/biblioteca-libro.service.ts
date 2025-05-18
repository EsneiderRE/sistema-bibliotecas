import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Biblioteca } from '../biblioteca/biblioteca.entity';
import { Libro } from '../libro/libro.entity';
import { BibliotecaService } from '../biblioteca/biblioteca.service';
import { LibroService } from '../libro/libro.service';

@Injectable()
export class BibliotecaLibroService {
  constructor(
    @InjectRepository(Biblioteca)
    private readonly bibliotecaRepository: Repository<Biblioteca>,
    private readonly bibliotecaService: BibliotecaService,
    private readonly libroService: LibroService,
  ) {}

  async addBookToLibrary(bibliotecaId: string, libroId: string): Promise<Biblioteca> {
    const biblioteca = await this.bibliotecaService.findOne(bibliotecaId);
    const libro = await this.libroService.findOne(libroId);
    
    if (!biblioteca.libros) {
      biblioteca.libros = [];
    }
    
    const yaExiste = biblioteca.libros.some(b => b.id === libro.id);
    
    if (!yaExiste) {
      biblioteca.libros.push(libro);
      return this.bibliotecaRepository.save(biblioteca);
    }
    
    return biblioteca;
  }

  async findBooksFromLibrary(bibliotecaId: string): Promise<Libro[]> {
    const biblioteca = await this.bibliotecaService.findOne(bibliotecaId);
    return biblioteca.libros;
  }

  async findBookFromLibrary(bibliotecaId: string, libroId: string): Promise<Libro> {
    const biblioteca = await this.bibliotecaService.findOne(bibliotecaId);
    
    const libro = biblioteca.libros.find(l => l.id === libroId);
    
    if (!libro) {
      throw new NotFoundException(`Libro con ID ${libroId} no encontrado en la biblioteca con ID ${bibliotecaId}`);
    }
    
    return libro;
  }

  async updateBooksFromLibrary(bibliotecaId: string, librosIds: string[]): Promise<Biblioteca> {
    const biblioteca = await this.bibliotecaService.findOne(bibliotecaId);
    
    const libros = await Promise.all(
      librosIds.map(id => this.libroService.findOne(id))
    );
    
    biblioteca.libros = libros;
    return this.bibliotecaRepository.save(biblioteca);
  }

  async deleteBookFromLibrary(bibliotecaId: string, libroId: string): Promise<Biblioteca> {
    const biblioteca = await this.bibliotecaService.findOne(bibliotecaId);
    
    await this.findBookFromLibrary(bibliotecaId, libroId);
    
    biblioteca.libros = biblioteca.libros.filter(libro => libro.id !== libroId);
    return this.bibliotecaRepository.save(biblioteca);
  }
}