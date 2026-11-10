import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '../auth/auth.guard';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
@UseGuards(AuthGuard)
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('imagen')
  @UseInterceptors(FileInterceptor('imagen'))
  async subirImagen(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png)$/,
          }),
        ],
      }),
    )
    archivo: Express.Multer.File,
  ) {
    return this.cloudinaryService.subirImagen(archivo);
  }
}
