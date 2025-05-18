import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBibliotecaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}-\d{2}:\d{2}$/, { 
    message: 'El horario debe tener el formato HH:MM-HH:MM' 
  })
  horarioAtencion: string;
}

export class UpdateBibliotecaDto extends PartialType(CreateBibliotecaDto) {}