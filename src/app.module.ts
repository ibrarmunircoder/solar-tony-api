import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { applicationConfig } from './config/app.config';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [applicationConfig] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (appConfig: ConfigType<typeof applicationConfig>) => ({
        uri: appConfig.database.connectionString,
      }),
      inject: [applicationConfig.KEY],
    }),
    ProductsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
