import { Test, TestingModule } from '@nestjs/testing';
import { CommercialAssistantController } from '../commercial-assistant.controller';
import { CommercialAssistantService } from '../commercial-assistant.service';
import { ConflictException } from '@nestjs/common';

describe('CommercialAssistantController', () => {
  let controller: CommercialAssistantController;
  let service: CommercialAssistantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommercialAssistantController],
      providers: [
        {
          provide: CommercialAssistantService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<CommercialAssistantController>(
      CommercialAssistantController,
    );
    service = module.get<CommercialAssistantService>(
      CommercialAssistantService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a commercial assistant', async () => {
    const dto = { name: 'Test', email: 'test@test.com', phone: '123456789' };
    jest.spyOn(service, 'create').mockResolvedValueOnce(dto as any);
    await expect(controller.create(dto)).resolves.toEqual(dto);
  });

  it('should throw a conflict exception if the commercial assistant already exists', async () => {
    const dto = { name: 'Test', email: 'test@test.com', phone: '123456789' };
    jest
      .spyOn(service, 'create')
      .mockRejectedValueOnce(new ConflictException());
    await expect(controller.create(dto)).rejects.toThrow(ConflictException);
  });

  it('should find all commercial assistants', async () => {
    const mockCommercialAssistants = [
      {
        id: '1',
        name: 'Vitória',
        email: 'vitoria@test.com',
        phone: '123456789',
        Customers: [],
      },
    ];
    jest.spyOn(service, 'findAll').mockResolvedValue(mockCommercialAssistants);
    await expect(controller.findAll()).resolves.toEqual(
      mockCommercialAssistants,
    );
    expect(service.findAll).toHaveBeenCalled();
  });
});
