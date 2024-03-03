import { Test, TestingModule } from '@nestjs/testing';
import { CommercialAssistantService } from '../commercial-assistant.service';

describe('CommercialAssistantService', () => {
  let service: CommercialAssistantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommercialAssistantService],
    }).compile();

    service = module.get<CommercialAssistantService>(CommercialAssistantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
