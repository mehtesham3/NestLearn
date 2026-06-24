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
import { Roles, RolesGuard } from 'src/guards/roles.guard';
import { userUpdateDTO } from './DTO/userUpdate.DTO';

@Controller('users')
@UseGuards(authGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles(['admin'])
  async allUsers() {
    const user = await this.usersService.getAllUser();
    return user;
  }

  @Get(':id')
  @Roles(['admin'])
  async getUser(@Param('id') id: string) {
    const userInfo = await this.usersService.getUserById(id);
    return userInfo;
  }

  @Put()
  async updateUser(@Body() updateUserDto: userUpdateDTO, @Request() req) {
    const userId = req.user.id;
    return this.usersService.updateDetails(userId, updateUserDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  async deleteUser(@Param('id') userId: string) {
    return this.usersService.softDelete(userId);
  }

  @Patch(':id')
  @Roles(['admin'])
  async activateUser(@Param('id') userId: string) {
    return this.usersService.actievateUser(userId);
  }
}
