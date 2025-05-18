import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class AddLibroToBibliotecaDto {
  @IsUUID()
  @IsNotEmpty()
  libroId: string;
}

export class UpdateLibrosBibliotecaDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  librosIds: string[];
}