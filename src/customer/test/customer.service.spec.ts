// customers.service.spec.ts
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
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
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

  it('should find customers by status', async () => {
    const customers = [
      {
        id: 'e40a7745-62ec-4bce-964e-c13bcdf34184',
        name: 'Jaymeson',
        code: 'XX30-2',
        network: 'Rede 1',
        commercialAssistantId: null,
      },
      {
        id: 'daf2eff2-a9fd-4528-95ce-fc0b942cf2f4',
        name: 'Jaymeson',
        code: 'CX30-2',
        network: 'Rede 1',
        commercialAssistantId: null,
      },
    ];
    jest
      .spyOn(prismaService.customers, 'findMany')
      .mockResolvedValue(customers);
    const result = await service.findCustomers('unlinked');
    expect(result).toEqual({ data: customers, count: 2 });
  });

  it('should check code availability', async () => {
    jest.spyOn(prismaService.customers, 'findUnique').mockResolvedValue(null);
    const result = await service.isCodeAvailable('XX40-2');
    expect(result).toEqual({ available: true });
  });
});
