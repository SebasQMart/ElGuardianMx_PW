import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';
import { AuthService } from './auth.service';

const SESSION_COOKIE = 'ogm_admin_session';

interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = request.cookies?.[SESSION_COOKIE];

    if (typeof token !== 'string') {
      throw new UnauthorizedException('No hay una sesión activa');
    }

    request.admin = await this.authService.validateSession(token);

    return true;
  }
}
