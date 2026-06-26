import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// This creates the decorator
export const Roles = Reflector.createDecorator<string[]>();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles
    const requiredRoles = this.reflector.get(Roles, context.getHandler());
    if (!requiredRoles) return true;

    // Get user from request
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('No user found');

    // Check if user has required role
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('You`re not allowed to access this route');
    }

    return true;
  }
}

// // auth/guards/roles.guard.ts
// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { SetMetadata } from '@nestjs/common';

// export const ROLES_KEY = 'roles';
// export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     // Get required roles
//     const requiredRoles = this.reflector.getAllAndOverride<string[]>(
//       ROLES_KEY,
//       [context.getHandler(), context.getClass()],
//     );

//     console.log('Required roles:', requiredRoles);

//     if (!requiredRoles || requiredRoles.length === 0) {
//       return true;
//     }

//     // Get user from request
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     console.log('User object:', user);

//     if (!user) {
//       throw new ForbiddenException('No user found');
//     }

//     // Check if user has required role
//     const userRole = user.role;
//     console.log('User role:', userRole);

//     const hasRole = requiredRoles.includes(userRole);
//     console.log('Has role:', hasRole);

//     if (!hasRole) {
//       throw new ForbiddenException('You`re not allowed to access this route');
//     }

//     return true;
//   }
// }
