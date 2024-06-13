import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {

  const logger = new Logger("Main-Gateway");

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  
  const config = new DocumentBuilder()
    .setTitle('Products Microservice')
    .setDescription('API Gateway Products Microservice')
    .setVersion('1.0')
    .addTag('Products')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter);

  await app.listen(envs.port);

  logger.log(`Gateway runnign on port ${envs.port}`);

}
bootstrap();
