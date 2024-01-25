import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<SolarPanelProduct>;

@Schema({
  collection: 'solar-panel-product',
})
export class SolarPanelProduct {
  @Prop({ type: String, required: true })
  ASIN: string;
  @Prop({ type: String, required: true })
  DetailPageURL: string;
  @Prop({ type: String, required: true })
  Brand: string;
  @Prop({ type: String, required: true })
  Manufacturer: string;
  @Prop({ type: String, required: true })
  Model: string;
  @Prop({ type: String, required: true })
  Color: string;
  @Prop({ type: String, required: true })
  Height: string;
  @Prop({ type: String, required: true })
  HeightUnit: string;
  @Prop({ type: String, required: true })
  Length: string;
  @Prop({ type: String, required: true })
  LengthUnit: string;
  @Prop({ type: String, required: true })
  Width: string;
  @Prop({ type: String, required: true })
  WidthLength: string;
  @Prop({ type: String, required: true })
  Size: string;
  @Prop({ type: String, required: true })
  NumberOfItems: string;
  @Prop({ type: String, required: true })
  Title: string;
  @Prop({ type: String, required: true })
  Availability: string;
  @Prop({ type: String, required: true })
  Condition: string;
  @Prop({ type: String, required: true })
  Price: string;
  @Prop({ type: String, required: true })
  PriceWithCurrency: string;
  @Prop({ type: String, required: true })
  Locale: string;
}

export const SolarPanelProductSchema =
  SchemaFactory.createForClass(SolarPanelProduct);
