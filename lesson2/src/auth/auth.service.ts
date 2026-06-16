import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entites';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async register(email: string, password: string): Promise<User> {
    this.logger.log(`Register new user with email : ${email}`);
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      this.logger.warn(`User with email : ${email} already exists`);
      throw new ConflictException('Email already registered');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepo.save({
      email: email,
      password: hashPassword,
      role: 'user',
    });
    this.logger.debug(`User registered with Id: ${(await newUser).id}`);
    return newUser;
  }

  async login(email: string, password: string) {
    const isExist = await this.userRepo.findOne({ where: { email } });
    this.logger.log(`Login attempt for email : ${email}`);
    if (!isExist) {
      this.logger.error(`Login attempt failed email not exists : ${email}`);
      throw new UnauthorizedException('Invalid Credentials');
    }

    const comparePass = await bcrypt.compare(password, isExist.password);
    if (!comparePass) {
      this.logger.error(
        `Login attempt failed for email : ${email} due to invalid password`,
      );
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payLoad = {
      userMail: isExist.email,
      sub: isExist.id,
    };
    this.logger.log(
      `User with email : ${payLoad.userMail} logged in successfully`,
    );
    return await this.jwtService.signAsync(payLoad);
  }
}
