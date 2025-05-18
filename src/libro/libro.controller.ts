import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { LibroService } from './libro.service';
import { CreateLibroDto, UpdateLibroDto } from './libro.dto';
import { Libro } from './libro.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('books')
export class LibroController {
    constructor(private readonly libroService: LibroService) {}

    @Get()
    async findAll(): Promise<Libro[]> {
        return await this.libroService.findAll();
    }

    @Get(':libroId')
    async findOne(@Param('libroId') libroId: string): Promise<Libro> {
        return await this.libroService.findOne(libroId);
    }

    @Post()
    async create(@Body() libroDto: CreateLibroDto): Promise<Libro> {
        return await this.libroService.create(libroDto);
    }

    @Put(':libroId')
    async update(@Param('libroId') libroId: string, @Body() libroDto: UpdateLibroDto): Promise<Libro> {
        return await this.libroService.update(libroId, libroDto);
    }

    @Delete(':libroId')
    @HttpCode(204)
    async delete(@Param('libroId') libroId: string) {
        return await this.libroService.delete(libroId);
    }
}