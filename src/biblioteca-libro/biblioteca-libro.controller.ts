import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { Libro } from '../libro/libro.entity';
import { UpdateLibrosBibliotecaDto } from './biblioteca-libro.dto';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('libraries')
export class BibliotecaLibroController {
    constructor(private readonly bibliotecaLibroService: BibliotecaLibroService) {}

    @Post(':bibliotecaId/books/:libroId')
    async addBookToLibrary(
        @Param('bibliotecaId') bibliotecaId: string, 
        @Param('libroId') libroId: string
    ): Promise<Libro> {
        return await this.bibliotecaLibroService.addBookToLibrary(bibliotecaId, libroId);
    }

    @Get(':bibliotecaId/books')
    async findBooksFromLibrary(
        @Param('bibliotecaId') bibliotecaId: string
    ): Promise<Libro[]> {
        return await this.bibliotecaLibroService.findBooksFromLibrary(bibliotecaId);
    }

    @Get(':bibliotecaId/books/:libroId')
    async findBookFromLibrary(
        @Param('bibliotecaId') bibliotecaId: string, 
        @Param('libroId') libroId: string
    ): Promise<Libro> {
        return await this.bibliotecaLibroService.findBookFromLibrary(bibliotecaId, libroId);
    }

    @Put(':bibliotecaId/books')
    async updateBooksFromLibrary(
        @Param('bibliotecaId') bibliotecaId: string, 
        @Body() dto: UpdateLibrosBibliotecaDto
    ): Promise<Libro[]> {
        return await this.bibliotecaLibroService.updateBooksFromLibrary(bibliotecaId, dto.librosIds);
    }

    @Delete(':bibliotecaId/books/:libroId')
    @HttpCode(204)
    async deleteBookFromLibrary(
        @Param('bibliotecaId') bibliotecaId: string, 
        @Param('libroId') libroId: string
    ): Promise<void> {
        await this.bibliotecaLibroService.deleteBookFromLibrary(bibliotecaId, libroId);
    }
}