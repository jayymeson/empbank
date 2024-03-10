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

  /**
   * Creates a new customer.
   * @param {CreateCustomerDto} createCustomerDto - Data Transfer Object for creating a customer.
   * @returns {Promise<Customers>} The created customer object.
   * @author Jaymeson
   */
  async create(createCustomerDto: CreateCustomerDto): Promise<Customers> {
    return this.prisma.customers.create({
      data: createCustomerDto,
    });
  }

  /**
   * Finds all customers without a linked commercial assistant.
   * @returns {Promise<{data: Customers[]; count: number}>} An object containing an array of customers and the count.
   * @author Jaymeson
   */
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

  /**
   * Checks if a customer code is available.
   * @param {string} code - The customer code to check.
   * @returns {Promise<{available: boolean}>} An object indicating if the code is available.
   * @author Jaymeson
   */
  async isCodeAvailable(code: string): Promise<{ available: boolean }> {
    const customer = await this.prisma.customers.findUnique({
      where: {
        code,
      },
    });
    return { available: !customer };
  }

  /**
   * Links customers to a commercial assistant.
   * @param {LinkCustomersDto} linkCustomersDto - DTO for linking customers.
   * @returns {Promise<void>} Void.
   * @author Jaymeson
   */
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

  /**
   * Unlinks customers from any commercial assistant.
   * @param {UnlinkCustomersDto} unlinkCustomersDto - DTO for unlinking customers.
   * @returns {Promise<void>} Void.
   * @author Jaymeson
   */
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

  /**
   * Finds customers by name or code.
   * @param {string} searchTerm - The search term (name or code).
   * @returns {Promise<Customers[]>} An array of customers that match the search term.
   * @author Jaymeson
   */
  async findCustomersByNameOrCode(searchTerm: string) {
    return this.prisma.customers.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive', // Para busca case-insensitive
            },
          },
          {
            code: {
              equals: searchTerm,
              mode: 'insensitive', // Para busca case-insensitive
            },
          },
        ],
      },
    });
  }
}
