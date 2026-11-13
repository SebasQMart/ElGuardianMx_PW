import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { Prisma, EstadoPublicacion } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PublicacionesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Consultar publicaciones visibles para el público.
  async findPublicadas() {
    return this.prisma.publicacion.findMany({
      where: {
        estado: EstadoPublicacion.PUBLICADA,
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  // Consultar una publicación pública por su slug.
  async findPublicadaBySlug(slug: string) {
    const publicacion = await this.prisma.publicacion.findFirst({
      where: {
        slug,
        estado: EstadoPublicacion.PUBLICADA,
      },
    });

    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }

    return publicacion;
  }

  // Consultar todas las publicaciones para administración.
  async findAllAdmin() {
    return this.prisma.publicacion.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  // Crear una publicación.
  async create(dto: CreatePublicacionDto) {
    try {
      const { fecha, contenido, ...campos } = dto;

      return await this.prisma.publicacion.create({
        data: {
          ...campos,
          contenido: contenido as Prisma.InputJsonValue,
          ...(fecha !== undefined && {
            fecha: new Date(fecha),
          }),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe una publicación con ese slug');
      }

      throw error;
    }
  }

  // Actualizar una publicación.
  async update(id: string, dto: UpdatePublicacionDto) {
    const existente = await this.prisma.publicacion.findUnique({
      where: { id },
    });

    if (!existente) {
      throw new NotFoundException('Publicación no encontrada');
    }

    try {
      const { fecha, contenido, ...campos } = dto;

      const data: Prisma.PublicacionUpdateInput = {
        ...campos,
        ...(contenido !== undefined && {
          contenido: contenido as Prisma.InputJsonValue,
        }),
        ...(fecha !== undefined && {
          fecha: new Date(fecha),
        }),
      };

      const actualizada = await this.prisma.publicacion.update({
        where: { id },
        data,
      });

      // Eliminar la imagen anterior si fue sustituida.
      if (
        existente.imagenPublicId &&
        dto.imagenPublicId !== undefined &&
        dto.imagenPublicId !== existente.imagenPublicId
      ) {
        try {
          await this.cloudinaryService.eliminarImagen(existente.imagenPublicId);
        } catch (error) {
          console.error(
            'No fue posible eliminar la imagen anterior de Cloudinary:',
            error,
          );
        }
      }

      return actualizada;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe otra publicación con ese slug');
      }

      throw error;
    }
  }

  // Eliminar una publicación.
  async remove(id: string) {
    const existente = await this.prisma.publicacion.findUnique({
      where: { id },
    });

    if (!existente) {
      throw new NotFoundException('Publicación no encontrada');
    }

    await this.prisma.publicacion.delete({
      where: { id },
    });

    // Eliminar la imagen asociada de Cloudinary.
    if (existente.imagenPublicId) {
      try {
        await this.cloudinaryService.eliminarImagen(existente.imagenPublicId);
      } catch (error) {
        console.error(
          'No fue posible eliminar la imagen de Cloudinary:',
          error,
        );
      }
    }

    return {
      message: 'Publicación eliminada correctamente',
    };
  }
}
