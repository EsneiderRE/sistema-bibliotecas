import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BibliotecaModule } from './biblioteca/biblioteca.module';
import { LibroModule } from './libro/libro.module';
import { BibliotecaLibroModule } from './biblioteca-libro/biblioteca-libro.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'bibliotecas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
      dropSchema: false,
    }),
    BibliotecaModule,
    LibroModule,
    BibliotecaLibroModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}