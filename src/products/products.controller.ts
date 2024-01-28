import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

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
}
