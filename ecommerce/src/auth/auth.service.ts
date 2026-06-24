import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
import { RegisterDTO } from './DTO/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './DTO/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDTO): Promise<User> {
    const existing = await this.userModel.findOne({ email: registerDto.email });
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const hashPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = new this.userModel({
      name: registerDto.name,
      email: registerDto.email,
      password: hashPassword,
      address: registerDto.address,
      role: registerDto.role || 'user',
    });

    return newUser.save();
  }

  // ): Promise<{ user: Omit<User, 'password'>; token: string }> {
  async login(loginDto: LoginDTO): Promise<{ msg: string }> {
    const isUserExist = await this.userModel.findOne({ email: loginDto.email });
    if (!isUserExist) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      isUserExist.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role,
      isActive: isUserExist.isActive,
    };
    if (!isUserExist.isActive)
      return {
        msg: `User with emailId: ${isUserExist.email} is suspended by admin. contact admin for more details`,
      };

    const token = await this.jwtService.signAsync(payload);
    const { password, ...userWithoutPassword } = isUserExist.toObject();

    // return { user: userWithoutPassword, token };
    return { msg: token };
  }

  async profile(id: string): Promise<{ user: Omit<User, 'password'> }> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { user };
  }
}
