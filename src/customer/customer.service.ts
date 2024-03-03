import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './models/dto/create-customers.dto';
import { Customers } from './models/entities/customers.interface';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customers> {
    return this.prisma.customers.create({
      data: createCustomerDto,
    });
  }

  async findCustomers(status?: string) {
    let whereCondition = {};

    if (status === 'unlinked') {
      whereCondition = {
        commercialAssistantId: null,
      };
    } else if (status === 'linked') {
      whereCondition = {
        NOT: {
          commercialAssistantId: null,
        },
      };
    }

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
}
