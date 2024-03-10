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
            findCustomers: jest.fn().mockResolvedValue({
              data: [],
              count: 0,
            }),
            isCodeAvailable: jest.fn(),
            linkCustomers: jest.fn(),
            unlinkCustomers: jest.fn(),
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

  it('should find unlinked customers', async () => {
    const expectedResponse = await service.findCustomers();
    const result = await controller.findCustomers();
    expect(result).toEqual(expectedResponse);
    expect(service.findCustomers).toHaveBeenCalled();
  });

  it('should check code availability', async () => {
    const code = 'XX40-2';
    const availability = { message: 'Code available' };
    jest
      .spyOn(service, 'isCodeAvailable')
      .mockResolvedValue({ available: true });
    expect(await controller.checkCodeAvailability(code)).toEqual(availability);
  });

  it('should link customers to a commercial assistant', async () => {
    const linkCustomersDto = {
      customerIds: ['uuid-customer-1', 'uuid-customer-2'],
      commercialAssistantId: 'uuid-assistant',
    };
    jest
      .spyOn(service, 'linkCustomers')
      .mockImplementation(async () => undefined);
    await expect(
      controller.linkCustomers(linkCustomersDto),
    ).resolves.toBeUndefined();
    expect(service.linkCustomers).toHaveBeenCalledWith(linkCustomersDto);
  });

  it('should unlink customers from any commercial assistant', async () => {
    const unlinkCustomersDto = {
      customerIds: ['uuid-customer-1', 'uuid-customer-2'],
    };
    jest
      .spyOn(service, 'unlinkCustomers')
      .mockImplementation(async () => undefined);
    await expect(
      controller.unlinkCustomers(unlinkCustomersDto),
    ).resolves.toBeUndefined();
    expect(service.unlinkCustomers).toHaveBeenCalledWith(unlinkCustomersDto);
  });
});
