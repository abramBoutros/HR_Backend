import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // Normally we would create an auth module and register the jwt module here but for simplicity we will register it with the users
    JwtModule.register({
      global: true,
      // Add the secret key which should be imported from a secure environment either local or on the cloud
      secret: 'mySecretKey',
      // I will only depend on the access token not refresh token as this should be an internal tool
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
