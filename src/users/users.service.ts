import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto } from './dtos';
import { UpdateUserDto } from './dtos';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // In production signup should be using email or sms verification using messaging queue tool + the user entry should start as disabled
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.userRepo.save(createUserDto);
      delete user.password;
      return user;
    } catch (e) {
      Logger.error(e);

      throw new BadRequestException('This email has already been used');
    }
  }

  // TODO: should add an interface for the return type
  async signin(loginUserRequest: LoginUserDto): Promise<any> {
    const user = await this.findOneByEmail(loginUserRequest.email);

    const isPasswordValid = await bcrypt.compare(
      loginUserRequest.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    delete user.password;

    return await this.jwtService.signAsync({
      id: user.id,
      username: user.name,
      email: user.email,
      role: user.role,
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    // I like to keep error handling embedded to search methods
    if (!user) throw new BadRequestException('User not found');

    return user;
  }

  async findAll() {
    // find all the users without the password (TODO: should be done from the repo by manipulating it)
    // this is a security measure to prevent the user from getting the password
    // TODO: Should add a filter to only return the users that are enabled
    // TODO: Should add pagination

    return await this.userRepo.find().then((users) => {
      users.forEach((user) => {
        delete user.password;
        return user;
      });
      return users;
    });
  }

  async findOneById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) throw new BadRequestException('User not found');

    return user;
  }

  async remove(id: number) {
    const user = await this.findOneById(id);
    // delete this found user
    await this.userRepo.delete(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);

    const updatedUser = await this.userRepo.save({
      ...user,
      ...updateUserDto,
    });

    delete updatedUser.password;

    return updatedUser;
  }
}
