import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

enum EstadoAudiencia {
  PROGRAMADA = 'PROGRAMADA',
  EN_PROCESO = 'EN_PROCESO',
  CELEBRADA = 'CELEBRADA',
  REPROGRAMADA = 'REPROGRAMADA',
  CANCELADA = 'CANCELADA',
}

export class CreateAudienciaDto {
  @IsString()
  @MinLength(3)
  @MaxLength(180)
  titulo: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  descripcion?: string;

  @IsDateString()
  fechaHora: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  tipo: string;

  @IsString()
  @MinLength(3)
  @MaxLength(180)
  juzgado: string;

  @IsOptional()
  @IsEnum(EstadoAudiencia)
  estado?: EstadoAudiencia;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  ubicacion?: string;
}