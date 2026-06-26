import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/exceptionFilter/transform.exceptionfilter';
import { WinstonModule } from 'nest-winston';
import { winstonLog } from './common/logger/logger.winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLog)
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('nestEcom')
    .setDescription('nestEcom is a ecommerce platform')
    .setVersion('1.0')
    .addBearerAuth()
    // .addTag('auth', 'Authentication endpoints')
    // .addTag('users', 'User management')
    // .addTag('products', 'Product operations')
    // .addTag('cart', 'Shopping cart')
    // .addTag('orders', 'Order management')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.use(helmet())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
