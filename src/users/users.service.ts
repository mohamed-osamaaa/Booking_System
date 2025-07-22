import { BadRequestException, Injectable } from '@nestjs/common';
import { userRegisterDto } from './dto/userRegisterDto';
import { userLoginDto } from './dto/userLoginDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async register(userRegisterDto: userRegisterDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: userRegisterDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is not available.');
    }

    const hashedPassword = await hash(userRegisterDto.password, 10);

    const user = this.usersRepository.create({
      ...userRegisterDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    const { password, ...rest } = savedUser;
    return rest;
  }

  async login(
    userLoginDto: userLoginDto,
  ): Promise<{ accessToken: string; user: Omit<User, 'password'> }> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email: userLoginDto.email })
      .getOne();

    if (!user) {
      throw new BadRequestException('Bad credentials.');
    }

    const isPasswordMatched = await compare(userLoginDto.password, user.password);
    if (!isPasswordMatched) {
      throw new BadRequestException('Bad credentials.');
    }

    const accessToken = await this.jwtService.signAsync({ id: user.id });

    const { password, ...userWithoutPassword } = user;

    return {
      accessToken,
      user: userWithoutPassword,
    };
  }

  async findOneById(id: string) {
    return await this.usersRepository.findOne({ where: { id: +id } });
  }
}
