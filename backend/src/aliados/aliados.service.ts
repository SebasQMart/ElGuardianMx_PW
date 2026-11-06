import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { Prisma, TipoAliado } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { CreateAliadoDto } from './dto/create-aliado.dto';
import { UpdateAliadoDto } from './dto/update-aliado.dto';

@Injectable()
export class AliadosService {
  constructor(private readonly prisma: PrismaService) {}

  // Consultar aliados activos para el público.
  async findActivos() {
    return this.prisma.aliado.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  // Consultar un aliado activo por su ID.
  async findActivoById(id: string) {
    const aliado = await this.prisma.aliado.findFirst({
      where: {
        id,
        activo: true,
      },
    });

    if (!aliado) {
      throw new NotFoundException('Aliado no encontrado');
    }

    return aliado;
  }

  // Consultar todos los aliados para administración.
  async findAllAdmin() {
    return this.prisma.aliado.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  // Crear un aliado.
  async create(dto: CreateAliadoDto) {
    const { tipo, ...campos } = dto;

    return this.prisma.aliado.create({
      data: {
        ...campos,
        tipo: tipo as TipoAliado,
      },
    });
  }

  // Actualizar un aliado.
  async update(id: string, dto: UpdateAliadoDto) {
    const existente = await this.prisma.aliado.findUnique({
      where: { id },
    });

    if (!existente) {
      throw new NotFoundException('Aliado no encontrado');
    }

    const { tipo, ...campos } = dto;

    const data: Prisma.AliadoUpdateInput = {
      ...campos,
      ...(tipo !== undefined && {
        tipo: tipo as TipoAliado,
      }),
    };

    return this.prisma.aliado.update({
      where: { id },
      data,
    });
  }

  // Eliminar un aliado.
  async remove(id: string) {
    const existente = await this.prisma.aliado.findUnique({
      where: { id },
    });

    if (!existente) {
      throw new NotFoundException('Aliado no encontrado');
    }

    await this.prisma.aliado.delete({
      where: { id },
    });

    return {
      message: 'Aliado eliminado correctamente',
    };
  }
}