import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CatalogosService } from './catalogos.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('catalogos')
export class CatalogosController {
  constructor(private readonly catalogosService: CatalogosService) {}

  @Get('tipos')
  obtenerTipos() {
    return this.catalogosService.obtenerTipos();
  }

  @Get('categorias')
  obtenerCategorias() {
    return this.catalogosService.obtenerCategorias();
  }

  @Post('tipos')
  @UseGuards(AuthGuard)
  agregarTipo(@Body('nombre') nombre: string) {
    return this.catalogosService.agregarTipo(nombre);
  }

  @Post('categorias')
  @UseGuards(AuthGuard)
  agregarCategoria(@Body('nombre') nombre: string) {
    return this.catalogosService.agregarCategoria(nombre);
  }
}
