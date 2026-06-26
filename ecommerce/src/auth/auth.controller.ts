import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/register.dto';
import { LoginDTO } from './DTO/login.dto';
import { authGuard } from './auth.guard';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get()
  @ApiOperation({ summary: 'Check auth route' })
  @ApiResponse({
    status: 200,
    description: 'Auth route is working',
  })
  test() {
    return 'Auth route is working';
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists'
  })
  async register(@Body() userRegister: RegisterDTO) {
    const user = await this.authService.register(userRegister);
    return user;
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ login: { limit: 3, ttl: 60000 } })
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() userLogin: LoginDTO) {
    const user = await this.authService.login(userLogin);
    return user;
  }

  // @SkipThrottle()
  @Get('profile')
  @UseGuards(authGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile fetched successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  async profile(@Request() req) {
    const user = await this.authService.profile(req.user.id);
    return user;
  }
}
