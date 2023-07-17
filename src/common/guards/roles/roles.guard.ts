import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { USER_ROLES } from 'src/common/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtToken = request.cookies?.jwt;
    if (!jwtToken)
      throw new UnauthorizedException(
        'You need to be signed in to preform this action',
      );
    const decodedToken = this.jwtService.verify(jwtToken);

    const userRole = decodedToken.role;
    if (userRole === USER_ROLES.HR) return true;
    else throw new UnauthorizedException('This actions must be done by an HR');
  }
}
