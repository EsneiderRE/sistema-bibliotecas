import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils';
import { Biblioteca } from './biblioteca.entity';
import { BibliotecaService } from './biblioteca.service';
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BibliotecaService', () => {
  let service: BibliotecaService;
  let repository: Repository<Biblioteca>;
  let bibliotecasList: Biblioteca[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BibliotecaService],
    }).compile();

    service = module.get<BibliotecaService>(BibliotecaService);
    repository = module.get<Repository<Biblioteca>>(getRepositoryToken(Biblioteca));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    bibliotecasList = [];
    for(let i = 0; i < 5; i++){
      const biblioteca: Biblioteca = {
        id: faker.string.uuid(),
        nombre: faker.company.name(),
        direccion: faker.location.streetAddress(),
        ciudad: faker.location.city(),
        horarioAtencion: '08:00-18:00',
        libros: []
      };
      bibliotecasList.push(biblioteca);
      await repository.save(biblioteca);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all bibliotecas', async () => {
    const bibliotecas: Biblioteca[] = await service.findAll();
    expect(bibliotecas).not.toBeNull();
    expect(bibliotecas).toHaveLength(bibliotecasList.length);
  });

  it('findOne should return a biblioteca by id', async () => {
    const storedBiblioteca: Biblioteca = bibliotecasList[0];
    const biblioteca: Biblioteca = await service.findOne(storedBiblioteca.id);
    expect(biblioteca).not.toBeNull();
    expect(biblioteca.nombre).toEqual(storedBiblioteca.nombre);
    expect(biblioteca.direccion).toEqual(storedBiblioteca.direccion);
  });

  it('findOne should throw an exception for an invalid biblioteca', async () => {
    await expect(() => service.findOne("0")).rejects.toThrow(NotFoundException);
  });

  it('create should return a new biblioteca', async () => {
    const biblioteca = {
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horarioAtencion: '09:00-17:00'
    };

    const newBiblioteca: Biblioteca = await service.create(biblioteca);
    expect(newBiblioteca).not.toBeNull();

    const storedBiblioteca: Biblioteca = await repository.findOne({where: {id: newBiblioteca.id}});
    expect(storedBiblioteca).not.toBeNull();
    expect(storedBiblioteca.nombre).toEqual(newBiblioteca.nombre);
    expect(storedBiblioteca.direccion).toEqual(newBiblioteca.direccion);
  });

  it('create should throw an exception for invalid horario format', async () => {
    const biblioteca = {
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horarioAtencion: 'horario inválido'
    };

    await expect(() => service.create(biblioteca)).rejects.toThrow(BadRequestException);
  });

  it('create should throw an exception when opening time is greater than closing time', async () => {
    const biblioteca = {
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horarioAtencion: '18:00-09:00'
    };

    await expect(() => service.create(biblioteca)).rejects.toThrow(BadRequestException);
  });

  it('update should modify a biblioteca', async () => {
    const biblioteca = bibliotecasList[0];
    const cambios = {
      nombre: "Nuevo nombre",
      direccion: "Nueva dirección",
      horarioAtencion: '10:00-20:00'
    };
  
    const updatedBiblioteca: Biblioteca = await service.update(biblioteca.id, cambios);
    expect(updatedBiblioteca).not.toBeNull();
  
    const storedBiblioteca: Biblioteca = await repository.findOne({ where: { id: biblioteca.id } });
    expect(storedBiblioteca).not.toBeNull();
    expect(storedBiblioteca.nombre).toEqual(cambios.nombre);
    expect(storedBiblioteca.direccion).toEqual(cambios.direccion);
    expect(storedBiblioteca.horarioAtencion).toEqual(cambios.horarioAtencion);
  });

  it('update should throw an exception for an invalid biblioteca', async () => {
    const cambios = {
      nombre: "Nuevo nombre",
      direccion: "Nueva dirección"
    };
    await expect(() => service.update("0", cambios)).rejects.toThrow(NotFoundException);
  });

  it('delete should remove a biblioteca', async () => {
    const biblioteca: Biblioteca = bibliotecasList[0];
    await service.delete(biblioteca.id);
  
    const deletedBiblioteca: Biblioteca = await repository.findOne({ where: { id: biblioteca.id } });
    expect(deletedBiblioteca).toBeNull();
  });

  it('delete should throw an exception for an invalid biblioteca', async () => {
    await expect(() => service.delete("0")).rejects.toThrow(NotFoundException);
  });
});