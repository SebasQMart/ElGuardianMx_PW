import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async subirImagen(archivo: Express.Multer.File) {
    return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'observatorio-justicia-morelos/publicaciones',
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png'],
          },
          (error, resultado) => {
            if (error || !resultado) {
              reject(
                new InternalServerErrorException(
                  'No fue posible subir la imagen.',
                ),
              );
              return;
            }

            resolve({
              url: resultado.secure_url,
              publicId: resultado.public_id,
            });
          },
        )
        .end(archivo.buffer);
    });
  }

  async eliminarImagen(publicId: string): Promise<void> {
    const resultado = await cloudinary.uploader.destroy(publicId);

    if (resultado.result !== 'ok' && resultado.result !== 'not found') {
      throw new InternalServerErrorException(
        'No fue posible eliminar la imagen.',
      );
    }
  }
}
