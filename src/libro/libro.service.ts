import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';
import { CreateLibroDto, UpdateLibroDto } from './libro.dto';

@Injectable()
export class LibroService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
  ) {}

  async findAll(): Promise<Libro[]> {
    return await this.libroRepository.find({ relations: ['bibliotecas'] });
  }

  async findOne(id: string): Promise<Libro> {
    const libro = await this.libroRepository.findOne({ 
      where: { id },
      relations: ['bibliotecas'],
    });
    
    if (!libro) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }
    
    return libro;
  }

  async create(createLibroDto: CreateLibroDto): Promise<Libro> {
    this.validateFechaPublicacion(new Date(createLibroDto.fechaPublicacion));
    
    const libro = this.libroRepository.create(createLibroDto);
    return await this.libroRepository.save(libro);
  }

  async update(id: string, updateLibroDto: UpdateLibroDto): Promise<Libro> {
    const libro = await this.findOne(id);
    
    if (updateLibroDto.fechaPublicacion) {
      this.validateFechaPublicacion(new Date(updateLibroDto.fechaPublicacion));
    }
    
    const updated = this.libroRepository.merge(libro, updateLibroDto);
    return await this.libroRepository.save(updated);
  }

  async delete(id: string): Promise<void> {
    const result = await this.libroRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }
  }

  private validateFechaPublicacion(fecha: Date): void {
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); 
    
    if (fecha > fechaActual) {
      throw new BadRequestException('La fecha de publicación no puede ser posterior a la fecha actual');
    }
  }
}