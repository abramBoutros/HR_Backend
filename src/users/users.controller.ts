import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { RolesGuard } from 'src/common/guards';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dtos';
import { UpdateUserDto } from './dtos';
import { User } from './entities';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() createUserRequest: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserRequest);
  }

  @Post('signin')
  // TODO: add an interface to the response
  async signin(
    @Body() loginUserRequest: LoginUserDto,
    // passthrough : true makes the nest app to send the cookie to the frontend to store
    @Res({ passthrough: true }) response: Response,
  ) {
    // Destruct the user and jwt
    const { jwt, user } = await this.usersService.signin(loginUserRequest);

    response.cookie('jwt', jwt, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
      path: '/',
    });

    // send the user back to store it in the redux sto or whatever based on the architecture, maybe the local storage if needed
    return user;
  }

  @Get()
  @UseGuards(RolesGuard)
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
    return { message: 'successful deletion' };
  }

  @Post('signout')
  async signout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'successful signout' };
  }
}
