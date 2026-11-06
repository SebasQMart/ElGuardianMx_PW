import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const admin = await this.prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin || !(await compare(password, admin.passwordHash))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

    await this.prisma.adminSession.create({
      data: {
        tokenHash,
        adminId: admin.id,
        expiresAt,
      },
    });

    return {
      token,
      expiresAt,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
  }

  async validateSession(token: string) {
    const tokenHash = this.hashToken(token);

    const session = await this.prisma.adminSession.findUnique({
      where: { tokenHash },
      include: { admin: true },
    });

    if (!session) {
      throw new UnauthorizedException('Sesión no válida');
    }

    if (session.expiresAt <= new Date()) {
      await this.prisma.adminSession.delete({
        where: { id: session.id },
      });

      throw new UnauthorizedException('La sesión ha expirado');
    }

    return {
      id: session.admin.id,
      email: session.admin.email,
    };
  }

  async logout(token?: string) {
    if (!token) return;

    await this.prisma.adminSession.deleteMany({
      where: { tokenHash: this.hashToken(token) },
    });
  }
}