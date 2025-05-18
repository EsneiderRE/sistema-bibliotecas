import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BibliotecaService } from './biblioteca.service';
import { CreateBibliotecaDto, UpdateBibliotecaDto } from './biblioteca.dto';
import { Biblioteca } from './biblioteca.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('libraries')
export class BibliotecaController {
    constructor(private readonly bibliotecaService: BibliotecaService) {}

    @Get()
    async findAll(): Promise<Biblioteca[]> {
        return await this.bibliotecaService.findAll();
    }

    @Get(':bibliotecaId')
    async findOne(@Param('bibliotecaId') bibliotecaId: string): Promise<Biblioteca> {
        return await this.bibliotecaService.findOne(bibliotecaId);
    }

    @Post()
    async create(@Body() bibliotecaDto: CreateBibliotecaDto): Promise<Biblioteca> {
        return await this.bibliotecaService.create(bibliotecaDto);
    }

    @Put(':bibliotecaId')
    async update(@Param('bibliotecaId') bibliotecaId: string, @Body() bibliotecaDto: UpdateBibliotecaDto): Promise<Biblioteca> {
        return await this.bibliotecaService.update(bibliotecaId, bibliotecaDto);
    }

    @Delete(':bibliotecaId')
    @HttpCode(204)
    async delete(@Param('bibliotecaId') bibliotecaId: string) {
        return await this.bibliotecaService.delete(bibliotecaId);
    }
}