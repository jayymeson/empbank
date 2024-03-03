import { Module } from '@nestjs/common';
import { CommercialAssistantService } from './commercial-assistant.service';
import { CommercialAssistantController } from './commercial-assistant.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommercialAssistantController],
  providers: [CommercialAssistantService],
})
export class CommercialAssistantModule {}
