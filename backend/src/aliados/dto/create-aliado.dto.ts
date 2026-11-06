import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

enum TipoAliado {
  PERSONA = 'PERSONA',
  ORGANIZACION = 'ORGANIZACION',
}

export class CreateAliadoDto {
  @IsString()
  @MinLength(2)
  @MaxLength(180)
  nombre: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  descripcion: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @IsUrl({ require_protocol: true })
  imagen?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  ubicacion?: string;

  @IsEnum(TipoAliado)
  tipo: TipoAliado;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @IsUrl({ require_protocol: true })
  sitioOficial?: string;
}