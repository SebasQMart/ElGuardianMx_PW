import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

import { AudienciasController } from './audiencias.controller';
import { AudienciasService } from './audiencias.service';

@Module({
  imports: [PrismaModule, AuthModule, CloudinaryModule],
  controllers: [AudienciasController],
  providers: [AudienciasService],
})
export class AudienciasModule {}