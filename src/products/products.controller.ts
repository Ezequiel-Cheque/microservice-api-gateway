import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common';
import { PRODUCTS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { catchError, firstValueFrom } from 'rxjs';

@ApiTags("Products")
@Controller('products')
export class ProductsController {
  
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy
  ) {}

  @Post()
  createProduct(@Body() body: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, body)
  }

  @Get()
  getProducts(@Query() params: PaginationDto) {
    return this.productsClient.send({ cmd: 'find_all_products' }, params);
  }

  @Get(":id")
  async getProductById(@Param("id", ParseIntPipe ) id: number) {
    // observable
    return this.productsClient.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError( err => { throw new RpcException(err) } )
      )
    // Promises
    // try {
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product' }, { id })
    //   );
    //   return product;
    // } catch(error) {
    //   throw new RpcException(error);
    // }
  }

  @Patch(":id")
  updateProduct(
    @Param("id", ParseIntPipe ) id: number,
    @Body() body: UpdateProductDto
  ) {
    const { name, price } = body;
    return this.productsClient.send({ cmd: 'update_product' }, { name, price, id })
      .pipe(
        catchError( err => { throw new RpcException(err) } )
      )
  }

  @Delete(":id")
  deleteProduct(@Param("id", ParseIntPipe ) id: number) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id })
      .pipe(
        catchError( err => { throw new RpcException(err) } )
      )
  }

}
