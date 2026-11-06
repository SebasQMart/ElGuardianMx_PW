import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

import { AliadosController } from './aliados.controller';
import { AliadosService } from './aliados.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AliadosController],
  providers: [AliadosService],
})
export class AliadosModule {}