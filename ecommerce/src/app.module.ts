import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    //Config for rateLimit
    ThrottlerModule.forRoot([
      {
        name: 'default', // Default for all endpoints
        ttl: 60000,
        limit: 30,
      },
      {
        name: 'login', // Specific for login
        ttl: 60000,
        limit: 5,
      },
    ]),

    ConfigModule.forRoot({
      //Config for environment variables
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      //Config for Database
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('CONN_STRING'),
      }),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// TypeOrmModule.forRootAsync({
//   useFactory: (configService: ConfigService) => ({
//     type: 'postgres',
//     host: configService.get('DB_HOST'),
//     port: configService.get('DB_PORT'),
//     username: configService.get('DB_USERNAME'),
//     password: configService.get('DB_PASSWORD'),
//     database: configService.get('DB_NAME'),
//     entities: [],
//     synchronize: true, //Only for development
//   }),
//   inject: [ConfigService],
// }),
