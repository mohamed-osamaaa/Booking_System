import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesResolver } from './services.resolver';
import { Service } from './entities/service.entity';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    CloudinaryModule
  ],
  providers: [ServicesService, ServicesResolver],
})
export class ServicesModule { }
