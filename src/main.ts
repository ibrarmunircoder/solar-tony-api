import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const whitelist = process.env.WHITELISTDOMAINS.split(',');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    // Pass the cookie
    credentials: true,
  });
  await app.listen(8000);
}
bootstrap();
