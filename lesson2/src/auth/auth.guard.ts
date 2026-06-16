import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader =
      request.headers['Authorization'] || request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const token = this.extractToken(authHeader);
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or Expired token');
    }
    return true;
  }

  private extractToken(authHeader: string): string {
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7, authHeader.length);
    }
    throw new UnauthorizedException('Invalid authorization header');
  }
}
