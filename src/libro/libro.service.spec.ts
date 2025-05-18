import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils';
import { Libro } from './libro.entity';
import { LibroService } from './libro.service';
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('LibroService', () => {
  let service: LibroService;
  let repository: Repository<Libro>;
  let librosList: Libro[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [LibroService],
    }).compile();

    service = module.get<LibroService>(LibroService);
    repository = module.get<Repository<Libro>>(getRepositoryToken(Libro));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
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
      await repository.save(libro);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all libros', async () => {
    const libros: Libro[] = await service.findAll();
    expect(libros).not.toBeNull();
    expect(libros).toHaveLength(librosList.length);
  });

  it('findOne should return a libro by id', async () => {
    const storedLibro: Libro = librosList[0];
    const libro: Libro = await service.findOne(storedLibro.id);
    expect(libro).not.toBeNull();
    expect(libro.titulo).toEqual(storedLibro.titulo);
    expect(libro.autor).toEqual(storedLibro.autor);
  });

  it('findOne should throw an exception for an invalid libro', async () => {
    await expect(() => service.findOne("0")).rejects.toThrow(NotFoundException);
  });

  it('create should return a new libro', async () => {
    const fechaPublicacion = faker.date.past();
    const libro = {
      titulo: faker.lorem.words(3),
      autor: faker.person.fullName(),
      fechaPublicacion,
      isbn: faker.string.alphanumeric(13)
    };

    const newLibro: Libro = await service.create(libro);
    expect(newLibro).not.toBeNull();

    const storedLibro: Libro = await repository.findOne({where: {id: newLibro.id}});
    expect(storedLibro).not.toBeNull();
    expect(storedLibro.titulo).toEqual(newLibro.titulo);
    expect(storedLibro.autor).toEqual(newLibro.autor);
  });

  it('create should throw an exception for future publication date', async () => {
    const libro = {
      titulo: faker.lorem.words(3),
      autor: faker.person.fullName(),
      fechaPublicacion: faker.date.future(),
      isbn: faker.string.alphanumeric(13)
    };

    await expect(() => service.create(libro)).rejects.toThrow(BadRequestException);
  });

  it('update should modify a libro', async () => {
    const libro = librosList[0];
    const cambios = {
      titulo: "Nuevo título",
      autor: "Nuevo autor"
    };
  
    const updatedLibro: Libro = await service.update(libro.id, cambios);
    expect(updatedLibro).not.toBeNull();
  
    const storedLibro: Libro = await repository.findOne({ where: { id: libro.id } });
    expect(storedLibro).not.toBeNull();
    expect(storedLibro.titulo).toEqual(cambios.titulo);
    expect(storedLibro.autor).toEqual(cambios.autor);
  });

  it('update should throw an exception for an invalid libro', async () => {
    const cambios = {
      titulo: "Nuevo título",
      autor: "Nuevo autor"
    };
    await expect(() => service.update("0", cambios)).rejects.toThrow(NotFoundException);
  });

  it('update should throw an exception for future publication date', async () => {
    const libro = librosList[0];
    const cambios = {
      fechaPublicacion: faker.date.future()
    };
    
    await expect(() => service.update(libro.id, cambios)).rejects.toThrow(BadRequestException);
  });

  it('delete should remove a libro', async () => {
    const libro: Libro = librosList[0];
    await service.delete(libro.id);
  
    const deletedLibro: Libro = await repository.findOne({ where: { id: libro.id } });
    expect(deletedLibro).toBeNull();
  });

  it('delete should throw an exception for an invalid libro', async () => {
    await expect(() => service.delete("0")).rejects.toThrow(NotFoundException);
  });
});