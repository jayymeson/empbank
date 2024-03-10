import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { CommercialAssistantService } from '../commercial-assistant.service';

describe('CommercialAssistantService', () => {
  let service: CommercialAssistantService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommercialAssistantService,
        {
          provide: PrismaService,
          useValue: {
            commercialAssistant: {
              create: jest.fn().mockImplementation((dto) => dto.data),
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CommercialAssistantService>(
      CommercialAssistantService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a commercial assistant', async () => {
    const dto = { name: 'Test', email: 'test@test.com', phone: '123456789' };
    await expect(service.create(dto)).resolves.toEqual({
      ...dto,
      phone: '+55123456789',
    });
    expect(prismaService.commercialAssistant.create).toHaveBeenCalledWith({
      data: { ...dto, phone: '+55123456789' },
    });
  });

  it('should format phone numbers correctly', () => {
    expect(service.formatPhone('123456789')).toBe('+55123456789');
    expect(service.formatPhone('+55123456789')).toBe('+55123456789');
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

    jest
      .spyOn(prismaService.commercialAssistant, 'findMany')
      .mockResolvedValue(mockCommercialAssistants);

    await expect(service.findAll()).resolves.toEqual(mockCommercialAssistants);
    expect(prismaService.commercialAssistant.findMany).toHaveBeenCalledWith({
      include: {
        Customers: true,
      },
    });
  });
});
