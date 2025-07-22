import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
    /**
     * Upload a single file to Cloudinary under the 'Services' folder.
     * @param file Express.Multer.File
     */
    async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
        if (!file || !file.buffer) {
            throw new BadRequestException('Invalid file');
        }

        try {
            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'Services' },
                    (error, result) => {
                        if (error || !result) return reject(error || new Error('Upload failed'));
                        resolve(result);
                    },
                );

                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });

            return result;
        } catch (error) {
            throw new InternalServerErrorException(`Cloudinary upload failed: ${error.message}`);
        }
    }

    /**
     * Upload multiple files to Cloudinary with max limit of 10 files.
     * @param files Array of Express.Multer.File
     */
    async uploadFiles(files: Express.Multer.File[]): Promise<UploadApiResponse[]> {
        if (!files || !Array.isArray(files) || files.length === 0) {
            throw new BadRequestException('No files provided');
        }

        if (files.length > 10) {
            throw new BadRequestException('You can upload a maximum of 10 images');
        }

        const uploadResults = await Promise.all(
            files.map(file => this.uploadFile(file))
        );

        return uploadResults;
    }
}
