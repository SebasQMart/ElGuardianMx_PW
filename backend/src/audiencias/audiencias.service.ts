import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, EstadoAudiencia } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { CreateAudienciaDto } from './dto/create-audiencia.dto';
import { UpdateAudienciaDto } from './dto/update-audiencia.dto';

@Injectable()
export class AudienciasService {
  constructor(private readonly prisma: PrismaService) {}

  // Consultar todas las audiencias para el público.
  async findAllPublic() {
    const audiencias = await this.prisma.audiencia.findMany();

    const ahora = new Date();

    return audiencias.sort((a, b) => {
      const fechaA = a.fechaHora.getTime();
      const fechaB = b.fechaHora.getTime();
      const esFuturaA = fechaA >= ahora.getTime();
      const esFuturaB = fechaB >= ahora.getTime();

      // Las próximas audiencias aparecen primero.
      if (esFuturaA && !esFuturaB) return -1;
      if (!esFuturaA && esFuturaB) return 1;

      // Las próximas se ordenan de la más cercana a la más lejana.
      if (esFuturaA && esFuturaB) return fechaA - fechaB;

      // Las pasadas se ordenan de la más reciente a la más antigua.
      return fechaB - fechaA;
    });
  }

  // Consultar una audiencia por su ID.
  async findById(id: string) {
    const audiencia = await this.prisma.audiencia.findUnique({
      where: { id },
    });

    if (!audiencia) {
      throw new NotFoundException('Audiencia no encontrada');
    }

    return audiencia;
  }

  // Consultar todas las audiencias para administración.
  async findAllAdmin() {
    return this.prisma.audiencia.findMany({
      orderBy: {
        fechaHora: 'asc',
      },
    });
  }

  // Crear una audiencia.
  async create(dto: CreateAudienciaDto) {
    const { fechaHora, estado, ...campos } = dto;

    return this.prisma.audiencia.create({
      data: {
        ...campos,
        fechaHora: new Date(fechaHora),
        ...(estado !== undefined && {
          estado: estado as EstadoAudiencia,
        }),
      },
    });
  }

  // Actualizar una audiencia.
  async update(id: string, dto: UpdateAudienciaDto) {
    const existente = await this.prisma.audiencia.findUnique({
      where: { id },
    });

    if (!existente) {
      throw new NotFoundException('Audiencia no encontrada');
    }

    const { fechaHora, estado, ...campos } = dto;

    const data: Prisma.AudienciaUpdateInput = {
      ...campos,
      ...(fechaHora !== undefined && {
        fechaHora: new Date(fechaHora),
      }),
      ...(estado !== undefined && {
        estado: estado as EstadoAudiencia,
      }),
    };

    return this.prisma.audiencia.update({
      where: { id },
      data,
    });
  }

  // Eliminar una audiencia.
  async remove(id: string) {
    const existente = await this.prisma.audiencia.findUnique({
      where: { id },
    });

    if (!existente) {
      throw new NotFoundException('Audiencia no encontrada');
    }

    await this.prisma.audiencia.delete({
      where: { id },
    });

    return {
      message: 'Audiencia eliminada correctamente',
    };
  }
}
