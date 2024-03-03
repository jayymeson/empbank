/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from '../customer.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CustomersService', () => {
  let service: CustomersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: PrismaService,
          useValue: {
            customers: {
              create: jest.fn().mockResolvedValue(undefined),
              findMany: jest.fn().mockResolvedValue(undefined),
              findUnique: jest.fn().mockResolvedValue(undefined),
              update: jest.fn().mockResolvedValue(undefined),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a customer', async () => {
    const dto = { name: 'Jaymeson', code: 'CX30-2', network: 'Rede 1' };
    const result = { ...dto, id: 'some-id', commercialAssistantId: null };
    jest.spyOn(prismaService.customers, 'create').mockResolvedValue(result);
    expect(await service.create(dto)).toEqual(result);
  });

  it('should find unlinked customers', async () => {
    const customers = [
      {
        id: 'uuid-customer-1',
        name: 'Customer One',
        code: 'C1',
        network: 'Network One',
        commercialAssistantId: null,
      },
      {
        id: 'uuid-customer-2',
        name: 'Customer Two',
        code: 'C2',
        network: 'Network Two',
        commercialAssistantId: null,
      },
    ];
    jest
      .spyOn(prismaService.customers, 'findMany')
      .mockResolvedValue(customers);
    const result = await service.findCustomers('unlinked');
    expect(result).toEqual({
      data: customers.map(({ commercialAssistantId, ...rest }) => rest),
      count: customers.length,
    });
  });

  it('should check code availability', async () => {
    jest.spyOn(prismaService.customers, 'findUnique').mockResolvedValue(null);
    const result = await service.isCodeAvailable('XX40-2');
    expect(result).toEqual({ available: true });
  });

  describe('linkCustomers', () => {
    it('should link customers to a commercial assistant', async () => {
      const linkCustomersDto = {
        customerIds: ['uuid-customer-1', 'uuid-customer-2'],
        commercialAssistantId: 'uuid-assistant',
      };
      const updateMock = jest.fn();
      prismaService.customers.update = updateMock;
      await service.linkCustomers(linkCustomersDto);
      expect(updateMock).toHaveBeenCalledTimes(
        linkCustomersDto.customerIds.length,
      );
      linkCustomersDto.customerIds.forEach((customerId, index) => {
        expect(updateMock).toHaveBeenNthCalledWith(index + 1, {
          where: { id: customerId },
          data: {
            commercialAssistantId: linkCustomersDto.commercialAssistantId,
          },
        });
      });
    });
  });

  describe('unlinkCustomers', () => {
    it('should unlink customers from any commercial assistant', async () => {
      const unlinkCustomersDto = {
        customerIds: ['uuid-customer-1', 'uuid-customer-2'],
      };
      const updateMock = jest.fn();
      prismaService.customers.update = updateMock;
      await service.unlinkCustomers(unlinkCustomersDto);
      expect(updateMock).toHaveBeenCalledTimes(
        unlinkCustomersDto.customerIds.length,
      );
      unlinkCustomersDto.customerIds.forEach((customerId, index) => {
        expect(updateMock).toHaveBeenNthCalledWith(index + 1, {
          where: { id: customerId },
          data: { commercialAssistantId: null },
        });
      });
    });
  });
});
