import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

const SESSION_COOKIE = 'ogm_admin_session';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException('Datos de acceso inválidos');
    }

    const data = body as Record<string, unknown>;

    if (
      typeof data.email !== 'string' ||
      typeof data.password !== 'string' ||
      !data.email.trim() ||
      !data.password ||
      data.email.length > 254 ||
      Buffer.byteLength(data.password, 'utf8') > 72
    ) {
      throw new BadRequestException('Datos de acceso inválidos');
    }

    const result = await this.authService.login(
      data.email,
      data.password,
    );

    response.cookie(SESSION_COOKIE, result.token, {
      ...cookieOptions,
      maxAge: result.expiresAt.getTime() - Date.now(),
    });

    response.setHeader('Cache-Control', 'no-store');

    return { admin: result.admin };
  }

  @Get('me')
  async me(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const token = request.cookies?.[SESSION_COOKIE];

    if (typeof token !== 'string') {
      throw new UnauthorizedException('No hay una sesión activa');
    }

    const admin = await this.authService.validateSession(token);

    response.setHeader('Cache-Control', 'no-store');

    return { admin };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = request.cookies?.[SESSION_COOKIE];

    await this.authService.logout(
      typeof token === 'string' ? token : undefined,
    );

    response.clearCookie(SESSION_COOKIE, cookieOptions);
    response.setHeader('Cache-Control', 'no-store');

    return { message: 'Sesión cerrada correctamente' };
  }
}