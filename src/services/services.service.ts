import { CloudinaryService } from './../utility/cloudinary/cloudinary.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/createServiceDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { FileUpload } from 'graphql-upload-minimal';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  async uploadAndGetImageUrls(files: FileUpload[]): Promise<string[]> {
    if (!Array.isArray(files)) {
      throw new Error('Invalid images input');
    }

    if (files.length > 10) {
      throw new Error('Maximum of 10 images allowed.');
    }

    const uploadPromises = files.map(async file => {
      const buffer = await this.convertToBuffer(file);
      const cloudinaryFile: Express.Multer.File = {
        buffer,
        originalname: file.filename,
        mimetype: file.mimetype,
        fieldname: file.filename,
        size: buffer.length,
        encoding: file.encoding,
        stream: file.createReadStream()
      } as unknown as Express.Multer.File;

      const uploadResult = await this.cloudinaryService.uploadFile(cloudinaryFile);
      return uploadResult.secure_url;
    });

    return await Promise.all(uploadPromises);
  }

  private async convertToBuffer(file: FileUpload): Promise<Buffer> {
    try {
      const stream = file.createReadStream();
      const chunks: Buffer[] = [];

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (err) {
      throw new Error(`Failed to read file stream: ${err.message}`);
    }
  }

  async createService(
    data: Omit<CreateServiceDto, 'images'>,
    imageUrls: string[]
  ): Promise<Service> {
    const service = this.serviceRepository.create({ ...data, images: imageUrls });
    return await this.serviceRepository.save(service);
  }

  async deleteService(id: string, providerId: string): Promise<{ message: string }> {
    const service = await this.serviceRepository.findOne({
      where: { id: +id },
      relations: ['owner'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.owner.id !== Number(providerId)) {
      throw new ForbiddenException('You are not authorized to delete this service');
    }

    await this.serviceRepository.remove(service);

    return { message: 'Service deleted successfully' };
  }

  async getAllServices(): Promise<Service[]> {
    const services = await this.serviceRepository.find();
    return services;
  }

  async getService(id: string): Promise<Service | null> {
    const service = await this.serviceRepository.findOne({
      where: { id: +id },
    });
    return service;
  }
}
