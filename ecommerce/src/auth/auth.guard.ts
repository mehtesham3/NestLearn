import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
@Injectable()
export class authGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Skip authentication
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader)
      throw new UnauthorizedException('Authorization header missing');
    const token = this.extractToken(authHeader);
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }
  private extractToken(authHeader: string): string {
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization header');
    }
    return token;
  }
}
