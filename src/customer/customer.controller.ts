import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customer.service';
import { CreateCustomerDto } from './models/dto/create-customers.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Customers } from './models/entities/customers.interface';
import { ApiTags } from '@nestjs/swagger';
import { LinkCustomersDto } from './models/dto/create-linkComercialAssistant.dto';
import { UnlinkCustomersDto } from './models/dto/create-unlinkCommercialAssistant.dto';

@ApiTags('Customers')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customers> {
    try {
      return await this.customersService.create(createCustomerDto);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Customer with code "${createCustomerDto.code}" already exists.`,
          );
        }
      }
      throw error;
    }
  }

  @Get('find')
  findCustomers(@Query('status') status?: string) {
    return this.customersService.findCustomers(status);
  }

  @Get('check-code')
  async checkCodeAvailability(@Query('code') code: string) {
    const availability = await this.customersService.isCodeAvailable(code);
    if (availability.available) {
      return { message: 'Code available' };
    } else {
      return { message: 'Code unavailable' };
    }
  }

  @Post('link-customers')
  async linkCustomers(@Body() linkCustomersDto: LinkCustomersDto) {
    await this.customersService.linkCustomers(linkCustomersDto);
  }

  @Post('unlink-customers')
  async unlinkCustomers(@Body() unlinkCustomersDto: UnlinkCustomersDto) {
    await this.customersService.unlinkCustomers(unlinkCustomersDto);
  }
}
