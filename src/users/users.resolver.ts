import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { userRegisterDto } from './dto/userRegisterDto';
import { userLoginDto } from './dto/userLoginDto';
import { LoginResponse } from './dto/LoginResponse';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => User)
  register(@Args('register') userRegisterDto: userRegisterDto) {
    return this.usersService.register(userRegisterDto);
  }

  @Mutation(() => LoginResponse)
  login(@Args('login') userLoginDto: userLoginDto) {
    return this.usersService.login(userLoginDto);
  }
}
