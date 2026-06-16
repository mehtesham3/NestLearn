import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-admin-key'];
    if (apiKey !== 'secret123') {
      throw new UnauthorizedException('Invalid apiKey ');
    }
    return true;
  }
}
