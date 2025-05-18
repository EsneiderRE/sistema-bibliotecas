import { IsNotEmpty, IsString, IsDateString, IsISBN } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateLibroDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  autor: string;

  @IsDateString()
  @IsNotEmpty()
  fechaPublicacion: Date;

  @IsString()
  @IsISBN()
  @IsNotEmpty()
  isbn: string;
}

export class UpdateLibroDto extends PartialType(CreateLibroDto) {}