import { Test, TestingModule } from '@nestjs/testing';
import { CommercialAssistantController } from './commercial-assistant.controller';
import { CommercialAssistantService } from './commercial-assistant.service';

describe('CommercialAssistantController', () => {
  let controller: CommercialAssistantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommercialAssistantController],
      providers: [CommercialAssistantService],
    }).compile();

    controller = module.get<CommercialAssistantController>(CommercialAssistantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
