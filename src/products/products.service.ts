import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { applicationConfig } from 'src/config/app.config';
import { SolarPanelProduct } from './schemas/solar-panel.schema';
import { Model } from 'mongoose';
const ProductAdvertisingAPIv1 = require('paapi5-nodejs-sdk');

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(SolarPanelProduct.name)
    private solarPanelProduct: Model<SolarPanelProduct>,
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
  ) {}

  private createApiClientWithParams(host: string, region: string) {
    const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
    defaultClient.accessKey = this.appConfig.amazonProductAdsApi.accessKey;
    defaultClient.secretKey = this.appConfig.amazonProductAdsApi.secretKey;
    defaultClient.host = host;
    defaultClient.region = region;
    return new ProductAdvertisingAPIv1.DefaultApi();
  }

  private createSearchItemsRequest(pageNumber: number) {
    const searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest();
    searchItemsRequest['PartnerTag'] = 'wealthvironme-20';
    searchItemsRequest['Keywords'] = 'solar panels';
    searchItemsRequest['PartnerType'] = 'Associates';
    searchItemsRequest['SearchIndex'] = 'GardenAndOutdoor';
    searchItemsRequest['BrowseNodeId'] = '2236628011';
    searchItemsRequest['ItemCount'] = 10;
    searchItemsRequest['ItemPage'] = pageNumber;
    searchItemsRequest['Resources'] = [
      'SearchRefinements',
      'ItemInfo.Classifications',
      'ItemInfo.ContentInfo',
      'ItemInfo.Features',
      'ItemInfo.ManufactureInfo',
      'ItemInfo.ProductInfo',
      'ItemInfo.Title',
      'ItemInfo.TradeInInfo',
      'ItemInfo.ByLineInfo',
      'ItemInfo.TechnicalInfo',
      'ItemInfo.ContentRating',
      'Offers.Listings.MerchantInfo',
      'Offers.Listings.Price',
      'Offers.Listings.Condition',
      'Offers.Listings.Availability.Type',
      'Offers.Listings.Promotions',
      'Offers.Listings.SavingBasis',
      'Offers.Summaries.HighestPrice',
    ];
    return searchItemsRequest;
  }

  private transformItem(items: any[]) {
    return items.map((item) => ({
      ASIN: item.ASIN,
      DetailPageURL: item.DetailPageURL,
      Brand: item.ItemInfo.ByLineInfo.Brand.DisplayValue,
      Manufacturer: item.ItemInfo.ByLineInfo.Manufacturer.DisplayValue,
      Model: item.ItemInfo.ManufactureInfo?.Model?.DisplayValue ?? 'N/A',
      Color: item.ItemInfo.ProductInfo?.Color?.DisplayValue ?? 'N/A',
      Height:
        item.ItemInfo.ProductInfo?.ItemDimensions?.Height?.DisplayValue ??
        'N/A',
      HeightUnit:
        item.ItemInfo.ProductInfo?.ItemDimensions?.Height?.Unit ?? 'N/A',
      Length:
        item.ItemInfo.ProductInfo?.ItemDimensions?.Length?.DisplayValue ??
        'N/A',
      LengthUnit:
        item.ItemInfo.ProductInfo?.ItemDimensions?.Length?.Unit ?? 'N/A',
      Width:
        item.ItemInfo.ProductInfo?.ItemDimensions?.Width?.DisplayValue ?? 'N/A',
      WidthLength:
        item.ItemInfo.ProductInfo?.ItemDimensions?.Width?.Unit ?? 'N/A',
      Size: item.ItemInfo.ProductInfo?.Size?.DisplayValue ?? 'N/A',
      NumberOfItems:
        item.ItemInfo.ProductInfo?.UnitCount?.DisplayValue ?? 'N/A',
      Title: item.ItemInfo.Title.DisplayValue,
      Availability: item.Offers?.Listings[0]?.Availability.Type ?? 'N/A',
      Condition:
        item.Offers?.Listings[0]?.Condition.Value ||
        item.Offers?.Summaries[0]?.HighestPrice?.DisplayAmount ||
        'N/A',
      Price:
        item.Offers?.Listings[0]?.Price.Amount ||
        item.Offers?.Summaries[0]?.HighestPrice?.Amount ||
        'N/A',
      PriceWithCurrency:
        item.Offers?.Listings[0]?.Price.DisplayAmount ||
        item.Offers?.Summaries[0]?.HighestPrice?.DisplayAmount ||
        'N/A',
      Locale: 'en_US',
    }));
  }

  public async searchProducts() {
    const apiClient = this.createApiClientWithParams(
      'webservices.amazon.com',
      'us-east-1',
    );
    let page = 1;
    const products = [];
    while (page <= 10) {
      const searchItemsRequest = this.createSearchItemsRequest(page);
      const data: any = await new Promise((res, rej) => {
        apiClient.searchItems(searchItemsRequest, (error, data) => {
          if (error) {
            rej(
              new BadRequestException(error?.message || 'Something went wrong'),
            );
            console.log('ERROR', error);
          } else {
            res(data);
          }
        });
      });
      const items = data.SearchResult.Items;
      const docs = this.transformItem(items);
      products.push(...docs);
      page++;
    }
    const productDocs = await this.solarPanelProduct.insertMany(products);
    return productDocs;
  }

  public async clearCollection() {
    await this.solarPanelProduct.deleteMany();
    return 'Deleted all the products';
  }

  public async getSolarProducts() {
    const productDocs = await this.solarPanelProduct.find({});
    return productDocs;
  }

  public async updateAmazondSolarProducts() {
    try {
      Logger.log('Started the job');
      await this.clearCollection();
      await this.searchProducts();
      Logger.log('completed the job');
    } catch (error) {
      Logger.error(error);
    }
  }
}
