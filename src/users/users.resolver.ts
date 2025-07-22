import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { userRegisterDto } from './dto/userRegisterDto';
import { userLoginDto } from './dto/userLoginDto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => User)
  createUser(@Args('register') userRegisterDto: userRegisterDto) {
    return this.usersService.register(userRegisterDto);
  }

  @Mutation(() => User)
  updateUser(@Args('login') userLoginDto: userLoginDto) {
    return this.usersService.login(userLoginDto);
  }
}
