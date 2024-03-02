import { Module } from '@nestjs/common';
import { CommercialAssistantService } from './commercial-assistant.service';
import { CommercialAssistantController } from './commercial-assistant.controller';

@Module({
  controllers: [CommercialAssistantController],
  providers: [CommercialAssistantService],
})
export class CommercialAssistantModule {}
