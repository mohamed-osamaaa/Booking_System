import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/createServiceDto';
import { UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { UserRole } from 'src/utility/enums/user-roles.enum';

@Resolver(() => Service)
export class ServicesResolver {
  constructor(
    private readonly servicesService: ServicesService,
  ) { }


  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.PROVIDER]))
  @Mutation(() => Service)
  async createService(
    @Args('createService') createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    const { images, ...serviceData } = createServiceDto;

    let imageUrls: string[] = [];

    if (images) {
      const resolvedImages = await images;
      imageUrls = await this.servicesService.uploadAndGetImageUrls(resolvedImages);
    }

    return this.servicesService.createService(serviceData, imageUrls);
  }

  @Query(() => [Service])
  async getAllServices(): Promise<Service[]> {
    return this.servicesService.getAllServices();
  }

  @Query(() => Service, { nullable: true })
  async getService(@Args('id') id: string): Promise<Service | null> {
    return this.servicesService.getService(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.PROVIDER]))
  @Mutation(() => String)
  async deleteService(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<string> {
    const currentUser = context.req.user;

    const result = await this.servicesService.deleteService(id, currentUser.id);
    return result.message;
  }
}
