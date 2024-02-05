import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Cron } from '@nestjs/schedule';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get('search')
  searchProducts() {
    return this.productsService.searchProducts();
  }

  @Get('clear')
  clearProducts() {
    return this.productsService.clearCollection();
  }

  @Get('/')
  getProducts() {
    return this.productsService.getSolarProducts();
  }

  @Cron('0 */2 * * *')
  async updateAmazondSolarProducts() {
    await this.productsService.updateAmazondSolarProducts();
  }
}
