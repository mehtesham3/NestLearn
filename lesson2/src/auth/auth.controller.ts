// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { RegisterDTO } from './dto/register.DTO';
// import { LoginDTO } from './dto/login.DTO';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';

// @ApiTags('Authentication')
// @Controller('auth')
// export class AuthController {
//   constructor(private authService: AuthService) {}

//   @Get()
//   @ApiResponse({ status: 200, description: 'Auth Service' })
//   authRntry() {
//     return { msg: 'Auth service' };
//   }

//   @Post('register')
//   @ApiResponse({ status: 201, description: 'User registered successfully' })
//   async register(@Body() userRegisterDTO: RegisterDTO) {
//     const user = await this.authService.register(
//       userRegisterDTO.email,
//       userRegisterDTO.password,
//     );

//     return { id: user.id, email: user.email };
//   }

//   @Post('login')
//   async login(@Body() loginUserDTO: LoginDTO) {
//     const user = await this.authService.login(
//       loginUserDTO.email,
//       loginUserDTO.password,
//     );

//     return user;
//   }
// }

// auth.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.DTO';
import { LoginDTO } from './dto/login.DTO';

@ApiTags('Authentication') // Groups all auth endpoints
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @ApiOperation({ summary: 'Check auth service status' })
  @ApiResponse({ status: 200, description: 'Auth service is running' })
  authEntry() {
    return { msg: 'Auth service' };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @ApiBody({ type: RegisterDTO }) // Shows DTO structure with examples
  async register(@Body() userRegisterDTO: RegisterDTO) {
    const user = await this.authService.register(
      userRegisterDTO.email,
      userRegisterDTO.password,
    );
    return { id: user.id, email: user.email };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDTO })
  async login(@Body() loginUserDTO: LoginDTO) {
    const token = await this.authService.login(
      loginUserDTO.email,
      loginUserDTO.password,
    );
    return { access_token: token };
  }
}
