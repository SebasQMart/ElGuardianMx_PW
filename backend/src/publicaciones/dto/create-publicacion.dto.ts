import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePublicacionDto {
  @IsString()
  @MinLength(3)
  @MaxLength(180)
  titulo: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  resumen?: string;

  @IsObject()
  contenido: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  categoria?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @IsUrl({ require_protocol: true })
  imagen?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagenPublicId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(300)
  lectura?: number;

  @IsOptional()
  @IsBoolean()
  demo?: boolean;

  @IsOptional()
  @IsIn(['BORRADOR', 'PUBLICADA', 'ARCHIVADA'])
  estado?: 'BORRADOR' | 'PUBLICADA' | 'ARCHIVADA';
}
