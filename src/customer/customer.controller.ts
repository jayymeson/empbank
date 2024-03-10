import {
  BadRequestException,
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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LinkCustomersDto } from './models/dto/create-linkComercialAssistant.dto';
import { UnlinkCustomersDto } from './models/dto/create-unlinkCommercialAssistant.dto';

@ApiTags('Customers')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Customer with code already exists',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Customers found successfully',
  })
  @ApiResponse({ status: 404, description: 'No customers found' })
  findCustomers() {
    return this.customersService.findCustomers();
  }

  @Get('check-code')
  @ApiResponse({
    status: 200,
    description: 'Code availability checked successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async checkCodeAvailability(@Query('code') code: string) {
    const availability = await this.customersService.isCodeAvailable(code);
    if (availability.available) {
      return { message: 'Code available' };
    } else {
      return { message: 'Code unavailable' };
    }
  }

  @Post('link-customers')
  @ApiResponse({
    status: 200,
    description: 'Customers linked to commercial assistant successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async linkCustomers(@Body() linkCustomersDto: LinkCustomersDto) {
    await this.customersService.linkCustomers(linkCustomersDto);
  }

  @Post('unlink-customers')
  @ApiResponse({
    status: 200,
    description: 'Customers unlinked from commercial assistant successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async unlinkCustomers(@Body() unlinkCustomersDto: UnlinkCustomersDto) {
    await this.customersService.unlinkCustomers(unlinkCustomersDto);
  }

  @Get('search')
  @ApiResponse({
    status: 200,
    description: 'Customers found by name or code successfully',
  })
  @ApiResponse({ status: 404, description: 'No customers found' })
  async searchCustomers(@Query('searchTerm') searchTerm: string) {
    if (!searchTerm) {
      throw new BadRequestException('Search term is required');
    }
    const customers =
      await this.customersService.findCustomersByNameOrCode(searchTerm);
    return customers;
  }
}
