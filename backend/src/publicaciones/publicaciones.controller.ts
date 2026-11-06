
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { PublicacionesService } from './publicaciones.service';
import { AuthGuard } from '../auth/auth.guard';

import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly publicacionesService: PublicacionesService,
  ) {}

  // RUTA ADMINISTRATIVA: consultar todas las publicaciones.
  @UseGuards(AuthGuard)
  @Get('admin/todas')
  findAllAdmin() {
    return this.publicacionesService.findAllAdmin();
  }

  // RUTA PÚBLICA: consultar publicaciones publicadas.
  @Get()
  findPublicadas() {
    return this.publicacionesService.findPublicadas();
  }

  // RUTA PÚBLICA: consultar detalle por slug.
  @Get(':slug')
  findPublicadaBySlug(@Param('slug') slug: string) {
    return this.publicacionesService.findPublicadaBySlug(slug);
  }

  // RUTA ADMINISTRATIVA: crear publicación.
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreatePublicacionDto) {
    return this.publicacionesService.create(dto);
  }

  // RUTA ADMINISTRATIVA: actualizar publicación.
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePublicacionDto,
  ) {
    return this.publicacionesService.update(id, dto);
  }

  // RUTA ADMINISTRATIVA: eliminar publicación.
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.publicacionesService.remove(id);
  }
}
