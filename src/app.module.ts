import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { BookingModule } from './booking/booking.module';
import { MessagesModule } from './messages/messages.module';
import { dataSourceOptions } from 'database/data-source';
import { CurrentUserMiddleware } from './utility/middlewares/current-user.middleware';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './utility/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    ServicesModule,
    BookingModule,
    MessagesModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
