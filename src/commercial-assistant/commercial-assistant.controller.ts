import { Controller } from '@nestjs/common';
import { CommercialAssistantService } from './commercial-assistant.service';

@Controller('commercial-assistant')
export class CommercialAssistantController {
  constructor(private readonly commercialAssistantService: CommercialAssistantService) {}
}
