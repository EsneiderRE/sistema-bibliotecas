import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Biblioteca } from './biblioteca.entity';
import { CreateBibliotecaDto, UpdateBibliotecaDto } from './biblioteca.dto';

@Injectable()
export class BibliotecaService {
  constructor(
    @InjectRepository(Biblioteca)
    private readonly bibliotecaRepository: Repository<Biblioteca>,
  ) {}

  async findAll(): Promise<Biblioteca[]> {
    return await this.bibliotecaRepository.find({ relations: ['libros'] });
  }

  async findOne(id: string): Promise<Biblioteca> {
    const biblioteca = await this.bibliotecaRepository.findOne({ 
      where: { id },
      relations: ['libros'],
    });
    
    if (!biblioteca) {
      throw new NotFoundException(`Biblioteca con ID ${id} no encontrada`);
    }
    
    return biblioteca;
  }

  async create(createBibliotecaDto: CreateBibliotecaDto): Promise<Biblioteca> {
    this.validateHorario(createBibliotecaDto.horarioAtencion);
    
    const biblioteca = this.bibliotecaRepository.create(createBibliotecaDto);
    return await this.bibliotecaRepository.save(biblioteca);
  }

  async update(id: string, updateBibliotecaDto: UpdateBibliotecaDto): Promise<Biblioteca> {
    const biblioteca = await this.findOne(id);
    
    if (updateBibliotecaDto.horarioAtencion) {
      this.validateHorario(updateBibliotecaDto.horarioAtencion);
    }
    
    const updated = this.bibliotecaRepository.merge(biblioteca, updateBibliotecaDto);
    return await this.bibliotecaRepository.save(updated);
  }

  async delete(id: string): Promise<void> {
    const result = await this.bibliotecaRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Biblioteca con ID ${id} no encontrada`);
    }
  }

  private validateHorario(horario: string): void {
    if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(horario)) {
      throw new BadRequestException('El horario debe tener el formato HH:MM-HH:MM');
    }

    const [horaApertura, horaCierre] = horario.split('-');
    
    const minutosApertura = this.convertirAMinutos(horaApertura);
    const minutosCierre = this.convertirAMinutos(horaCierre);
    
    if (minutosApertura >= minutosCierre) {
      throw new BadRequestException('La hora de apertura debe ser menor a la hora de cierre');
    }
  }

  private convertirAMinutos(hora: string): number {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }
}