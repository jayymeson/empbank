import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { CommercialAssistantService } from './commercial-assistant.service';
import { CommercialAssistant } from './models/interface/commercialAssistant.interface';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CommercialAssistantDto } from './models/dto/create-commercialAssistant.dto';

@Controller('commercial-assistant')
export class CommercialAssistantController {
  constructor(
    private readonly commercialAssistantService: CommercialAssistantService,
  ) {}

  @Post()
  async create(
    @Body() commercialAssistantDto: CommercialAssistantDto,
  ): Promise<CommercialAssistant> {
    try {
      return await this.commercialAssistantService.create(
        commercialAssistantDto,
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          let message = 'Conflict error';
          if (error.meta && typeof error.meta.target === 'string') {
            const target = error.meta.target;
            message = `Commercial Assistant with this ${target} already exists.`;
          } else if (error.meta && Array.isArray(error.meta.target)) {
            const target = error.meta.target.join(', ');
            message = `Commercial Assistant with this ${target} already exists.`;
          }
          throw new ConflictException(message);
        }
      }
      throw error;
    }
  }

  @Get()
  findAll(@Query('ca') ca?: string): Promise<CommercialAssistant[]> {
    return this.commercialAssistantService.findAll(ca);
  }
}
