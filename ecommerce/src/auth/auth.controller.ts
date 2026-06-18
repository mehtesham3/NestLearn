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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  test() {
    return 'Auth route is working';
  }

  @Post('register')
  async register(@Body() userRegister: RegisterDTO) {
    const user = await this.authService.register(userRegister);
    return user;
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ login: { limit: 3, ttl: 60000 } })
  @Post('login')
  async login(@Body() userLogin: LoginDTO) {
    const user = await this.authService.login(userLogin);
    return user;
  }

  // @SkipThrottle()
  @Get('profile')
  @UseGuards(authGuard)
  async profile(@Request() req) {
    const user = await this.authService.profile(req.user.id);
    return user;
  }
}
