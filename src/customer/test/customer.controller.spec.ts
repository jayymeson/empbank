// customer.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../customer.controller';
import { CustomersService } from '../customer.service';
import { CreateCustomerDto } from '../models/dto/create-customers.dto';
import { ConflictException } from '@nestjs/common';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            create: jest.fn(),
            findCustomers: jest.fn(),
            isCodeAvailable: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should create a customer successfully', async () => {
    const dto: CreateCustomerDto = {
      name: 'Jaymeson',
      code: 'CX30-2',
      network: 'Rede 1',
    };
    const result = { ...dto, id: 'some-id' };
    jest.spyOn(service, 'create').mockResolvedValue(result);
    expect(await controller.create(dto)).toEqual(result);
  });

  it('should throw a conflict exception if the customer code already exists', async () => {
    const dto: CreateCustomerDto = {
      name: 'Jaymeson',
      code: 'CX30-2',
      network: 'Rede 1',
    };
    jest
      .spyOn(service, 'create')
      .mockRejectedValue(
        new ConflictException(
          `Customer with code "${dto.code}" already exists.`,
        ),
      );
    await expect(controller.create(dto)).rejects.toThrow(ConflictException);
  });

  it('should find customers', async () => {
    const status = 'unlinked';
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
      .spyOn(service, 'findCustomers')
      .mockResolvedValue({ data: customers, count: 2 });
    expect(await controller.findCustomers(status)).toEqual({
      data: customers,
      count: 2,
    });
  });

  it('should check code availability', async () => {
    const code = 'XX40-2';
    const availability = { message: 'Code available' };
    jest
      .spyOn(service, 'isCodeAvailable')
      .mockResolvedValue({ available: true });
    expect(await controller.checkCodeAvailability(code)).toEqual(availability);
  });
});
