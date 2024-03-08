/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './models/dto/create-customers.dto';
import { Customers } from './models/entities/customers.interface';
import { LinkCustomersDto } from './models/dto/create-linkComercialAssistant.dto';
import { UnlinkCustomersDto } from './models/dto/create-unlinkCommercialAssistant.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customers> {
    return this.prisma.customers.create({
      data: createCustomerDto,
    });
  }

  async findCustomers() {
    const whereCondition = { commercialAssistantId: null };

    const customers = await this.prisma.customers.findMany({
      where: whereCondition,
    });

    return {
      data: customers,
      count: customers.length,
    };
  }

  async isCodeAvailable(code: string): Promise<{ available: boolean }> {
    const customer = await this.prisma.customers.findUnique({
      where: {
        code,
      },
    });
    return { available: !customer };
  }

  async linkCustomers(linkCustomersDto: LinkCustomersDto): Promise<void> {
    await Promise.all(
      linkCustomersDto.customerIds.map((customerId) =>
        this.prisma.customers.update({
          where: { id: customerId },
          data: {
            commercialAssistantId: linkCustomersDto.commercialAssistantId,
          },
        }),
      ),
    );
  }

  async unlinkCustomers(unlinkCustomersDto: UnlinkCustomersDto): Promise<void> {
    await Promise.all(
      unlinkCustomersDto.customerIds.map((customerId) =>
        this.prisma.customers.update({
          where: { id: customerId },
          data: { commercialAssistantId: null },
        }),
      ),
    );
  }
}
