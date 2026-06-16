import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import {
  loggerMiddelware,
  LoggerMiddelware,
} from './middelwares/logger.middelware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './DbIntegrate/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddelware).forRoutes('profile');
  }
}
