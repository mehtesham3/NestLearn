import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
import { userUpdateDTO } from './DTO/userUpdate.DTO';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) { }
  private readonly logger = new Logger(UsersService.name);

  async getAllUser(): Promise<{
    total: number;
    user: Omit<User, 'password'>[];
  }> {
    const allUser = await this.userModel.find().select('-password');
    if (!allUser) {
      this.logger.error('no users found')
      throw new NotFoundException('User not found ');
    }
    this.logger.log('all users fetched')
    return { total: allUser.length, user: allUser };
  }
  async getUserById(id: string): Promise<{ user: Omit<User, 'password'> }> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      this.logger.error(`no user found for id: ${id}`)
      throw new NotFoundException('User not found ');
    }
    this.logger.log(`user fetched for id: ${id}`)
    return { user };
  }

  async updateDetails(
    userId: string,
    user: userUpdateDTO,
  ): Promise<{ updatedUser: Omit<User, 'password'> }> {
    let updateDetails: any = {
      name: user.name,
      email: user.email,
      address: user.address,
    };

    //remove undefined details
    Object.keys(updateDetails).forEach(
      (key) => updateDetails[key] === undefined && delete updateDetails[key],
    );

    if (user.password) {
      const hashPass = await bcrypt.hash(user.password, 10);
      user.password = hashPass;
    }
    const updateUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateDetails,
      {
        new: true,
      },
    );

    if (!updateUser) {
      this.logger.error(`no user found for id: ${userId}`)
      throw new NotFoundException(`User with id: ${userId} not exist`);
    }
    this.logger.log(`user updated for id: ${userId}`)
    const { password, ...userWithoutPassword } = updateUser.toObject();
    return { updatedUser: userWithoutPassword };
  }

  async softDelete(
    userId: string,
  ): Promise<{ msg: string; deleteUser: Omit<User, 'password' | 'role'> }> {
    const update = {
      isActive: false,
    };
    const softDel = await this.userModel.findByIdAndUpdate(userId, update, {
      returnDocument: 'after',
      lean: true,
    });
    if (!softDel) {
      this.logger.error(`no user found for id: ${userId}`)
      throw new NotFoundException(`User with id:${userId} doesn't exist`);
    }
    this.logger.log(`user deleted for id: ${userId}`)
    const { password, role, ...user } = softDel;
    return { msg: `User with id:${userId} deleted`, deleteUser: user };
  }

  async actievateUser(
    userId: string,
  ): Promise<{ msg: string; activateUser: Omit<User, 'password' | 'role'> }> {
    const update = {
      isActive: true,
    };
    const activateUser = await this.userModel.findByIdAndUpdate(
      userId,
      update,
      {
        new: true,
        lean: true,
      },
    );
    if (!activateUser) {
      this.logger.error(`no user found for id: ${userId}`)
      throw new NotFoundException(`User with id:${userId} doesn't exist`);
    }
    this.logger.log(`user activated for id: ${userId}`)
    const { password, role, ...user } = activateUser;
    return { msg: `User with id:${userId} activated`, activateUser: user };
  }
}
