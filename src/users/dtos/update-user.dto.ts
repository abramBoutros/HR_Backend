import { IsIn, IsString, IsOptional, Matches } from 'class-validator';

import { UserRoles, USER_ROLES } from '../../common/enums';

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsIn(Object.values(USER_ROLES))
  role: UserRoles;

  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
    message: 'Invalid attendance time format. Expected format: HH:mm:ss',
  })
  @IsOptional()
  attendance: string;
}
