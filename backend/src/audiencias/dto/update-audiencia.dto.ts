import { PartialType } from '@nestjs/mapped-types';
import { CreateAudienciaDto } from './create-audiencia.dto';

export class UpdateAudienciaDto extends PartialType(CreateAudienciaDto) {}
