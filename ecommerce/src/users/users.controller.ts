import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { authGuard, Public } from 'src/auth/auth.guard';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { userUpdateDTO } from './DTO/userUpdate.DTO';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
@UseGuards(authGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'all users fetched' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBearerAuth()
  @Roles(['admin'])
  async allUsers() {
    const user = await this.usersService.getAllUser();
    return user;
  }

  @Get(':id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'user fetched' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBearerAuth()
  async getUser(@Param('id') id: string) {
    const userInfo = await this.usersService.getUserById(id);
    return userInfo;
  }

  @Put()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'user updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBearerAuth()
  async updateUser(@Body() updateUserDto: userUpdateDTO, @Request() req) {
    const userId = req.user.id;
    return this.usersService.updateDetails(userId, updateUserDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'user deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBearerAuth()
  async deleteUser(@Param('id') userId: string) {
    return this.usersService.softDelete(userId);
  }

  @Patch(':id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({ status: 200, description: 'user activated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBearerAuth()
  async activateUser(@Param('id') userId: string) {
    return this.usersService.actievateUser(userId);
  }
}
