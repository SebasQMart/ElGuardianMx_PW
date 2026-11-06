import { PartialType } from '@nestjs/mapped-types';
import { CreateAliadoDto } from './create-aliado.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAliadoDto extends PartialType(CreateAliadoDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}