import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true, //You don't need to re-import JwtModule in other modules (e.g. AuthModule, UsersModule, etc.) if you want to inject or use JwtService.
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule { }
