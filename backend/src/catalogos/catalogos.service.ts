import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogosService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTipos() {
    return this.prisma.opcionTipoPublicacion.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async obtenerCategorias() {
    return this.prisma.opcionCategoriaPublicacion.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async agregarTipo(nombre: string) {
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio || nombreLimpio.length > 100) {
      throw new BadRequestException(
        'El tipo debe tener entre 1 y 100 caracteres.',
      );
    }

    try {
      return await this.prisma.opcionTipoPublicacion.create({
        data: { nombre: nombreLimpio },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        throw new ConflictException('Este tipo ya existe.');
      }

      throw error;
    }
  }

  async agregarCategoria(nombre: string) {
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio || nombreLimpio.length > 100) {
      throw new BadRequestException(
        'La categoría debe tener entre 1 y 100 caracteres.',
      );
    }

    try {
      return await this.prisma.opcionCategoriaPublicacion.create({
        data: { nombre: nombreLimpio },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        throw new ConflictException('Esta categoría ya existe.');
      }

      throw error;
    }
  }
}
