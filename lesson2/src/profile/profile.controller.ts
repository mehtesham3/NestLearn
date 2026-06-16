import { Controller, Get, Logger, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/auth/auth.guard';
import { winstonLog } from 'src/logger/logger.winston';

@Controller('profile')
export class ProfileController {
  @Get()
  getProfile() {
    Logger.log('Accessing profile endpoint', 'ProfileController');
    return { message: 'This is the profile endpoint' };
  }
  @Get('secure')
  @UseGuards(ApiKeyGuard)
  @ApiBearerAuth()
  getSecureProfile(@Request() req) {
    const user = req.user; // Access the user information from the request object
    Logger.log(
      `Accessing secure profile endpoint by user: ${user.userMail}`,
      'ProfileController',
    );
    return {
      user: user,
      message:
        'This is the secure profile endpoint, accessible only to authenticated users',
    };
  }
}
