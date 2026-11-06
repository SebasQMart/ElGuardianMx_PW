import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { AliadosModule } from './aliados/aliados.module';
import { AudienciasModule } from './audiencias/audiencias.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PublicacionesModule,
    AliadosModule,
    AudienciasModule,
  ],
})
export class AppModule {}