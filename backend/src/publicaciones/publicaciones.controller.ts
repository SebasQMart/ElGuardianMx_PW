
import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { PublicacionesService } from './publicaciones.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly publicacionesService: PublicacionesService,
  ) {}

  // Ruta administrativa: consultar todas las publicaciones.
  @UseGuards(AuthGuard)
  @Get('admin/todas')
  findAllAdmin() {
    return this.publicacionesService.findAllAdmin();
  }

  // Ruta pública: consultar publicaciones publicadas.
  @Get()
  findPublicadas() {
    return this.publicacionesService.findPublicadas();
  }

  // Ruta pública: consultar detalle por slug.
  @Get(':slug')
  findPublicadaBySlug(@Param('slug') slug: string) {
    return this.publicacionesService.findPublicadaBySlug(slug);
  }
}
