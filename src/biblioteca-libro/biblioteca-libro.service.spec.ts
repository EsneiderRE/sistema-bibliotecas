import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils';
import { Biblioteca } from '../biblioteca/biblioteca.entity';
import { Libro } from '../libro/libro.entity';
import { BibliotecaService } from '../biblioteca/biblioteca.service';
import { LibroService } from '../libro/libro.service';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';

describe('BibliotecaLibroService', () => {
  let service: BibliotecaLibroService;
  let bibliotecaRepository: Repository<Biblioteca>;
  let libroRepository: Repository<Libro>;
  let biblioteca: Biblioteca;
  let librosList: Libro[];
  let bibliotecaService: BibliotecaService;
  let libroService: LibroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BibliotecaLibroService, BibliotecaService, LibroService],
    }).compile();

    service = module.get<BibliotecaLibroService>(BibliotecaLibroService);
    bibliotecaRepository = module.get<Repository<Biblioteca>>(getRepositoryToken(Biblioteca));
    libroRepository = module.get<Repository<Libro>>(getRepositoryToken(Libro));
    bibliotecaService = module.get<BibliotecaService>(BibliotecaService);
    libroService = module.get<LibroService>(LibroService);
    
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await libroRepository.clear();
    await bibliotecaRepository.clear();
    
    librosList = [];
    for(let i = 0; i < 5; i++){
      const libro: Libro = {
        id: faker.string.uuid(),
        titulo: faker.lorem.words(3),
        autor: faker.person.fullName(),
        fechaPublicacion: faker.date.past(),
        isbn: faker.string.alphanumeric(13),
        biblioteca: null
      };
      librosList.push(libro);
      await libroRepository.save(libro);
    }

    biblioteca = {
      id: faker.string.uuid(),
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horarioAtencion: '08:00-18:00',
      libros: []
    };
    await bibliotecaRepository.save(biblioteca);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addBookToLibrary should add a libro to a biblioteca', async () => {
    const libro = librosList[0];
    
    const result = await service.addBookToLibrary(biblioteca.id, libro.id);
    
    expect(result).not.toBeNull();
    expect(result.id).toBe(libro.id);
    expect(result.titulo).toBe(libro.titulo);
    
    const updatedBiblioteca = await bibliotecaService.findOne(biblioteca.id);
    expect(updatedBiblioteca.libros).not.toBeNull();
    expect(updatedBiblioteca.libros.length).toBe(1);
    expect(updatedBiblioteca.libros[0].id).toBe(libro.id);
  });

  it('addBookToLibrary should throw an exception for an invalid biblioteca', async () => {
    const libro = librosList[0];
    await expect(() => service.addBookToLibrary("0", libro.id)).rejects.toThrow(NotFoundException);
  });

  it('addBookToLibrary should throw an exception for an invalid libro', async () => {
    await expect(() => service.addBookToLibrary(biblioteca.id, "0")).rejects.toThrow(NotFoundException);
  });

  it('findBooksFromLibrary should return all libros from a biblioteca', async () => {
    const libro1 = librosList[0];
    const libro2 = librosList[1];
    
    await service.addBookToLibrary(biblioteca.id, libro1.id);
    await service.addBookToLibrary(biblioteca.id, libro2.id);
    
    const result = await service.findBooksFromLibrary(biblioteca.id);
    expect(result).not.toBeNull();
    expect(result.length).toBe(2);
  });

  it('findBooksFromLibrary should throw an exception for an invalid biblioteca', async () => {
    await expect(() => service.findBooksFromLibrary("0")).rejects.toThrow(NotFoundException);
  });

  it('findBookFromLibrary should return a libro from a biblioteca', async () => {
    const libro = librosList[0];
    
    await service.addBookToLibrary(biblioteca.id, libro.id);
    
    const result = await service.findBookFromLibrary(biblioteca.id, libro.id);
    expect(result).not.toBeNull();
    expect(result.id).toBe(libro.id);
    expect(result.titulo).toBe(libro.titulo);
  });

  it('findBookFromLibrary should throw an exception for libro not associated with biblioteca', async () => {
    const libro = librosList[0];
    await expect(() => 
      service.findBookFromLibrary(biblioteca.id, libro.id)
    ).rejects.toThrow(NotFoundException);
  });

  it('updateBooksFromLibrary should update libros of a biblioteca', async () => {
    const libro1 = librosList[0];
    const libro2 = librosList[1];
    
    await service.addBookToLibrary(biblioteca.id, libro1.id);
    
    const result = await service.updateBooksFromLibrary(biblioteca.id, [libro2.id]);
    
    expect(result).not.toBeNull();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(libro2.id);
    
    const updatedBiblioteca = await bibliotecaService.findOne(biblioteca.id);
    expect(updatedBiblioteca.libros).not.toBeNull();
    expect(updatedBiblioteca.libros.length).toBe(1);
    expect(updatedBiblioteca.libros[0].id).toBe(libro2.id);
  });

  it('updateBooksFromLibrary should throw an exception for an invalid biblioteca', async () => {
    const libro = librosList[0];
    await expect(() => 
      service.updateBooksFromLibrary("0", [libro.id])
    ).rejects.toThrow(NotFoundException);
  });

  it('deleteBookFromLibrary should remove a libro from a biblioteca', async () => {
    const libro = librosList[0];
    
    await service.addBookToLibrary(biblioteca.id, libro.id);
    
    await service.deleteBookFromLibrary(biblioteca.id, libro.id);
    
    const updatedBiblioteca = await bibliotecaService.findOne(biblioteca.id);
    expect(updatedBiblioteca.libros).not.toBeNull();
    expect(updatedBiblioteca.libros.length).toBe(0);
  });

  it('deleteBookFromLibrary should throw an exception for libro not associated with biblioteca', async () => {
    const libro = librosList[0];
    await expect(() => 
      service.deleteBookFromLibrary(biblioteca.id, libro.id)
    ).rejects.toThrow(NotFoundException);
  });
});