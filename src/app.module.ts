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
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { verify } from 'jsonwebtoken';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // playground: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      csrfPrevention: false,
      introspection: true,
      context: ({ req }) => {
        // Safely extract Authorization header
        const authHeader =
          typeof req?.headers?.authorization === 'string'
            ? req.headers.authorization
            : Array.isArray(req?.headers?.authorization)
            ? req.headers.authorization[0]
            : null;

        let currentUser: any = null;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          try {
            // Verify token and attach its payload as currentUser
            // Expecting payload to contain at least: { id: string, roles?: string[] }
            const payload = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY!);
            currentUser = payload;
          } catch (err) {
            // Invalid token -> keep currentUser as null
            currentUser = null;
          }
        }

        // Return context accessible via GqlExecutionContext
        return { req, currentUser };
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore,
        host: 'localhost', // or your Redis host (production host)
        port: 6379,
        ttl: 60 * 5, // 5 minutes default
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,     // Time to live in seconds
          limit: 10,   // Max requests per ttl
        },
      ],
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
