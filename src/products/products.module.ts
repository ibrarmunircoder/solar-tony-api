import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {
  SolarPanelProduct,
  SolarPanelProductSchema,
} from './schemas/solar-panel.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SolarPanelProduct.name, schema: SolarPanelProductSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
