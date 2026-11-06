
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicacionesService {
  constructor(private readonly prisma: PrismaService) {}

  // Consultar publicaciones visibles para el público.
  async findPublicadas() {
    return this.prisma.publicacion.findMany({
      where: {
        estado: 'PUBLICADA',
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
        estado: 'PUBLICADA',
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
}
