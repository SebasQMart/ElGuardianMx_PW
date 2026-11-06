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

import { AudienciasService } from './audiencias.service';
import { AuthGuard } from '../auth/auth.guard';

import { CreateAudienciaDto } from './dto/create-audiencia.dto';
import { UpdateAudienciaDto } from './dto/update-audiencia.dto';

@Controller('audiencias')
export class AudienciasController {
  constructor(
    private readonly audienciasService: AudienciasService,
  ) {}

  // RUTA ADMINISTRATIVA: consultar todas las audiencias.
  @UseGuards(AuthGuard)
  @Get('admin/todas')
  findAllAdmin() {
    return this.audienciasService.findAllAdmin();
  }

  // RUTA PÚBLICA: consultar todas las audiencias.
  @Get()
  findAllPublic() {
    return this.audienciasService.findAllPublic();
  }

  // RUTA PÚBLICA: consultar una audiencia por ID.
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.audienciasService.findById(id);
  }

  // RUTA ADMINISTRATIVA: crear audiencia.
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateAudienciaDto) {
    return this.audienciasService.create(dto);
  }

  // RUTA ADMINISTRATIVA: actualizar audiencia.
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAudienciaDto,
  ) {
    return this.audienciasService.update(id, dto);
  }

  // RUTA ADMINISTRATIVA: eliminar audiencia.
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.audienciasService.remove(id);
  }
}