import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

import { UserRoles, USER_ROLES } from '../../common/enums';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  // Add Password validation as needed
  @IsStrongPassword(
    { minLength: 5 },
    {
      message: 'Password is too weak',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(USER_ROLES))
  role: UserRoles;

  // we should add status here to be controlled by admins or HR
}
