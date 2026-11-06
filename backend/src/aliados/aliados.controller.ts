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

import { AliadosService } from './aliados.service';
import { AuthGuard } from '../auth/auth.guard';

import { CreateAliadoDto } from './dto/create-aliado.dto';
import { UpdateAliadoDto } from './dto/update-aliado.dto';

@Controller('aliados')
export class AliadosController {
  constructor(
    private readonly aliadosService: AliadosService,
  ) {}

  // RUTA ADMINISTRATIVA: consultar todos los aliados.
  @UseGuards(AuthGuard)
  @Get('admin/todos')
  findAllAdmin() {
    return this.aliadosService.findAllAdmin();
  }

  // RUTA PÚBLICA: consultar aliados activos.
  @Get()
  findActivos() {
    return this.aliadosService.findActivos();
  }

  // RUTA PÚBLICA: consultar un aliado activo por ID.
  @Get(':id')
  findActivoById(@Param('id', ParseUUIDPipe) id: string) {
    return this.aliadosService.findActivoById(id);
  }

  // RUTA ADMINISTRATIVA: crear aliado.
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateAliadoDto) {
    return this.aliadosService.create(dto);
  }

  // RUTA ADMINISTRATIVA: actualizar aliado.
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAliadoDto,
  ) {
    return this.aliadosService.update(id, dto);
  }

  // RUTA ADMINISTRATIVA: eliminar aliado.
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.aliadosService.remove(id);
  }
}